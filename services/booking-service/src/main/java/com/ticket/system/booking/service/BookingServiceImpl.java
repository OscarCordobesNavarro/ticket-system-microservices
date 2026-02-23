package com.ticket.system.booking.service;

import com.ticket.system.booking.model.Booking;
import com.ticket.system.booking.model.BookingStatus;
import com.ticket.system.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.ticket.system.booking.client.EventClient;
import com.ticket.system.booking.config.RabbitMQConfig;
import com.ticket.system.booking.dto.BookingCreatedEvent;
import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.dto.StockResponseDTO;
import com.ticket.system.booking.exception.BookingNotFoundException;
import com.ticket.system.booking.exception.NotEnoughStockException;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final StringRedisTemplate redisTemplate;
    private final RabbitTemplate rabbitTemplate;
    private final EventClient eventClient;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequest) {
        String stockKey = String.format("event:%d:ticket:%d:stock", bookingRequest.getEventId(),
                bookingRequest.getTicketTypeId());

        // Obtener stock actual antes del decremento
        String currentStockStr = redisTemplate.opsForValue().get(stockKey);

        if (currentStockStr == null) {
            log.info("Stock no encontrado en Redis para evento {} y ticket {}. Cargando desde catálogo...",
                    bookingRequest.getEventId(), bookingRequest.getTicketTypeId());

            // Cargar desde el catálogo
            com.ticket.system.booking.dto.EventDTO event = eventClient.getEventById(bookingRequest.getEventId());
            com.ticket.system.booking.dto.TicketTypeDTO ticketType = event.getTicketTypes().stream()
                    .filter(tt -> tt.getId().equals(bookingRequest.getTicketTypeId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Tipo de ticket no encontrado en el catálogo"));

            // Inicializar en Redis (usamos capacity como stock inicial)
            redisTemplate.opsForValue().set(stockKey, String.valueOf(ticketType.getCapacity()));
            currentStockStr = String.valueOf(ticketType.getCapacity());
        }

        Long currentStock = Long.valueOf(currentStockStr);

        // Operación atómica en Redis
        Long remainingStock = redisTemplate.opsForValue().decrement(stockKey, bookingRequest.getQuantity());

        if (remainingStock < 0) {
            redisTemplate.opsForValue().increment(stockKey, bookingRequest.getQuantity()); // Revertir decremento
            throw new NotEnoughStockException(currentStock.intValue()); // Lanzar con stock original
        }

        // Guardamos
        Booking booking = Booking.builder()
                .eventId(bookingRequest.getEventId())
                .ticketTypeId(bookingRequest.getTicketTypeId())
                .userId(bookingRequest.getUserId())
                .quantity(bookingRequest.getQuantity())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        booking = bookingRepository.save(booking);

        // Enviar mensaje a RabbitMQ
        BookingCreatedEvent event = BookingCreatedEvent.builder()
                .bookingId(booking.getId())
                .eventId(booking.getEventId())
                .ticketTypeId(booking.getTicketTypeId())
                .quantity(booking.getQuantity())
                .userId(booking.getUserId())
                .build();

        rabbitTemplate.convertAndSend(RabbitMQConfig.BOOKING_EXCHANGE, RabbitMQConfig.BOOKING_CREATED_ROUTING_KEY,
                event);

        return convertToResponseDTO(booking);

    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            // Devolver el stock a Redis
            String stockKey = String.format("event:%d:ticket:%d:stock", booking.getEventId(),
                    booking.getTicketTypeId());
            redisTemplate.opsForValue().increment(stockKey, booking.getQuantity());
        }
    }

    @Override
    public StockResponseDTO setStock(Long eventId, Long ticketTypeId, Integer quantity) {
        // Podríamos validar contra el catalog-service si el ticketTypeId pertenece al
        // eventId
        // eventClient.getEventById(eventId);

        String stockKey = String.format("event:%d:ticket:%d:stock", eventId, ticketTypeId);
        redisTemplate.opsForValue().set(stockKey, String.valueOf(quantity));

        return StockResponseDTO.builder()
                .eventId(eventId)
                .quantity(quantity)
                .message("Stock actualizado correctamente para el tipo de entrada " + ticketTypeId)
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Override
    public Long getStock(Long eventId, Long ticketTypeId) {
        String stockKey = String.format("event:%d:ticket:%d:stock", eventId, ticketTypeId);
        String val = redisTemplate.opsForValue().get(stockKey);
        return val != null ? Long.valueOf(val) : 0L;
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            log.info("Reserva {} confirmada exitosamente", bookingId);
        }
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::convertToResponseDTO)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .eventId(booking.getEventId())
                .ticketTypeId(booking.getTicketTypeId())
                .userId(booking.getUserId())
                .quantity(booking.getQuantity())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .expiresAt(booking.getExpiresAt())
                .build();
    }
}