package com.ticket.system.booking.consumer;

import com.ticket.system.booking.model.Booking;
import com.ticket.system.booking.model.BookingStatus;
import com.ticket.system.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingConsumer {

    private final BookingRepository bookingRepository;
    private final StringRedisTemplate redisTemplate;

    public static final String BOOKING_FAILED_QUEUE = "booking.failed.queue";

    @RabbitListener(queues = BOOKING_FAILED_QUEUE)
    @Transactional
    public void consumePaymentFailedEvent(Map<String, Object> event) {
        log.error("Recibido evento de pago fallido: {}", event);

        Long bookingId = Long.valueOf(event.get("bookingId").toString());
        Long eventId = Long.valueOf(event.get("eventId").toString());
        Integer quantity = Integer.valueOf(event.get("quantity").toString());

        // 1. Compensación en DB: Cancelar la reserva
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
            log.info("Reserva {} marcada como CANCELADA", bookingId);
        });

        // 2. Compensación en Redis: Devolver el stock
        String stockKey = "event:stock:" + eventId;
        redisTemplate.opsForValue().increment(stockKey, quantity);
        log.info("Stock devuelto a Redis para el evento {}: +{}", eventId, quantity);
    }
}
