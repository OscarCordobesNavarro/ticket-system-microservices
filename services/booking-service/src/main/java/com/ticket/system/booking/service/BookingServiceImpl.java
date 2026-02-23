package com.ticket.system.booking.service;

import com.ticket.system.booking.client.EventClient;
import com.ticket.system.booking.config.RabbitMQConfig;
import com.ticket.system.booking.dto.*;
import com.ticket.system.booking.exception.BookingNotFoundException;
import com.ticket.system.booking.exception.NotEnoughStockException;
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

        // Intentar obtener de Redis para ver si ya está inicializado
        String currentStockStr = redisTemplate.opsForValue().get(stockKey);
        Long remainingStock;

        if (currentStockStr == null) {
            log.info("Stock no encontrado en Redis para evento {} y ticket {}. Cargando desde catálogo...",
                    bookingRequest.getEventId(), bookingRequest.getTicketTypeId());
            // Carga e inicializa en Redis
            loadStockFromCatalog(bookingRequest.getEventId(), bookingRequest.getTicketTypeId(), stockKey);
        }

        // Operación atómica en Redis
        remainingStock = redisTemplate.opsForValue().decrement(stockKey, bookingRequest.getQuantity());

        if (remainingStock < 0) {
            redisTemplate.opsForValue().increment(stockKey, bookingRequest.getQuantity()); // Revertir decremento
            // El stock antes del decremento era (remainingStock + cantidad solicitada)
            throw new NotEnoughStockException((int) (remainingStock + bookingRequest.getQuantity()));
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

            // Devolver stock a Redis
            String stockKey = String.format("event:%d:ticket:%d:stock", booking.getEventId(),
                    booking.getTicketTypeId());
            redisTemplate.opsForValue().increment(stockKey, booking.getQuantity());

            log.info("Reserva {} cancelada. Stock devuelto para ticket type {}", bookingId, booking.getTicketTypeId());
        }
    }

    @Override
    public StockResponseDTO initStock(Long eventId, Long ticketTypeId, Integer quantity) {
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

        if (val == null) {
            log.info("Stock no encontrado en Redis para evento {} y ticket {}. Cargando desde catálogo...",
                    eventId, ticketTypeId);
            return loadStockFromCatalog(eventId, ticketTypeId, stockKey);
        }

        return Long.valueOf(val);
    }

    private Long loadStockFromCatalog(Long eventId, Long ticketTypeId, String stockKey) {
        // Cargar desde el catálogo
        com.ticket.system.booking.dto.EventDTO event = eventClient.getEventById(eventId);
        com.ticket.system.booking.dto.TicketTypeDTO ticketType = event.getTicketTypes().stream()
                .filter(tt -> tt.getId().equals(ticketTypeId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tipo de ticket no encontrado en el catálogo"));

        // Inicializar en Redis (usamos capacity como stock inicial)
        // Usamos setIfAbsent para evitar sobreescribir si otra instancia lo cargó justo
        // ahora
        Boolean initialized = redisTemplate.opsForValue().setIfAbsent(stockKey,
                String.valueOf(ticketType.getCapacity()));

        if (Boolean.TRUE.equals(initialized)) {
            return Long.valueOf(ticketType.getCapacity());
        } else {
            // Si ya estaba inicializado por otro proceso, leemos el valor actual
            String currentVal = redisTemplate.opsForValue().get(stockKey);
            return currentVal != null ? Long.valueOf(currentVal) : Long.valueOf(ticketType.getCapacity());
        }
    }

    @Override
    @Transactional
    public void confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));

        if (booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            log.info("Reserva {} confirmada", bookingId);
        }
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        return bookingRepository.findById(id)
                .map(this::convertToResponseDTO)
                .orElseThrow(() -> new BookingNotFoundException(id));
    }

    @Override
    public List<BookingResponseDTO> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void setStock(Long eventId, Long ticketTypeId, Integer quantity) {
        String stockKey = String.format("event:%d:ticket:%d:stock", eventId, ticketTypeId);
        redisTemplate.opsForValue().set(stockKey, String.valueOf(quantity));
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