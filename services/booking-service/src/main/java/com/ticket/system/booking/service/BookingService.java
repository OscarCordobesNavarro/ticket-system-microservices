package com.ticket.system.booking.service;

import com.ticket.system.booking.model.Booking;
import com.ticket.system.booking.model.BookingStatus;
import com.ticket.system.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import com.ticket.system.booking.config.RabbitMQConfig;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final StringRedisTemplate redisTemplate; // Herramienta para hablar con Redis

    private final RabbitTemplate rabbitTemplate;

    @Transactional
    public Booking createBooking(Long eventId, String userId, Integer quantity) {
        // 1. Clave de Redis para el stock de este evento
        String stockKey = "event:stock:" + eventId;

        // 2. Operación Atómica en Redis: decrementa el stock
        // Si el resultado es < 0, significa que no había suficientes entradas
        Long remainingStock = redisTemplate.opsForValue().decrement(stockKey, quantity);

        if (remainingStock == null || remainingStock < 0) {
            // Si nos pasamos, "devolvemos" lo que intentamos quitar (rollback manual en
            // Redis)
            redisTemplate.opsForValue().increment(stockKey, quantity);
            throw new RuntimeException("No hay suficientes entradas disponibles");
        }

        // 3. Si llegamos aquí, tenemos los asientos. Guardamos en la base de datos
        // (Postgres)
        Booking booking = Booking.builder()
                .eventId(eventId)
                .userId(userId)
                .quantity(quantity)
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        booking = bookingRepository.save(booking);

        // Enviamos el evento DESPUÉS de guardar en la DB para asegurar que tenemos el
        // ID
        Map<String, Object> event = Map.of(
                "bookingId", booking.getId(),
                "eventId", booking.getEventId(),
                "quantity", booking.getQuantity(),
                "userId", booking.getUserId());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EXCHANGE,
                RabbitMQConfig.BOOKING_CREATED_ROUTING_KEY,
                event);

        return booking;
    }
}