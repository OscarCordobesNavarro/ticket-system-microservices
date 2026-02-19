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
import java.util.Map;
import com.ticket.system.booking.config.RabbitMQConfig;
import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.exception.BookingNotFoundException;
import com.ticket.system.booking.exception.NotEnoughStockException;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final StringRedisTemplate redisTemplate; 
    private final RabbitTemplate rabbitTemplate;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequest) {
        String stockKey = "event:stock:" + bookingRequest.getEventId();

        // Operación atómica en Redis
        Long remainingStock = redisTemplate.opsForValue().decrement(stockKey, bookingRequest.getQuantity());

        if (remainingStock == null || remainingStock < 0) {
            redisTemplate.opsForValue().increment(stockKey, bookingRequest.getQuantity()); // Revertir decremento
            throw new NotEnoughStockException(remainingStock != null ? remainingStock.intValue() : 0);
            // Aquí es donde se lanza la excepción que el GlobalExceptionHandler capturará
        }

        // Guardamos
        Booking booking = Booking.builder()
                .eventId(bookingRequest.getEventId())
                .userId(bookingRequest.getUserId())
                .quantity(bookingRequest.getQuantity())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10)) // Expira en 15 minutos
                .build();
        
        booking = bookingRepository.save(booking);

        // Enviar mensaje a RabbitMQ
        Map<String, Object> event = Map.of(
                "bookingId", booking.getId(),
                "eventId", booking.getEventId(),
                "quantity", booking.getQuantity(),
                "userId", booking.getUserId());

        rabbitTemplate.convertAndSend(RabbitMQConfig.BOOKING_EXCHANGE, RabbitMQConfig.BOOKING_CREATED_ROUTING_KEY, event);

        return convertToResponseDTO(booking);

    }

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFoundException(bookingId));
        
        if(booking.getStatus() == BookingStatus.PENDING) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);

            // Devolver el stock a Redis
            String stockKey = "event:stock:" + booking.getEventId();
            redisTemplate.opsForValue().increment(stockKey, booking.getQuantity());
        }
    }

    @Override
    public void setStock(Long eventId, Integer quantity) {
        redisTemplate.opsForValue().set("event:stock:" + eventId, String.valueOf(quantity));
    }

    @Override
    public Long getStock(Long eventId) {
        String val = redisTemplate.opsForValue().get("event:stock:" + eventId);
        return val != null ? Long.valueOf(val) : 0L;
    }

    private BookingResponseDTO convertToResponseDTO(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .eventId(booking.getEventId())
                .userId(booking.getUserId())
                .quantity(booking.getQuantity())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .expiresAt(booking.getExpiresAt())
                .build();
    }
}