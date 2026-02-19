package com.ticket.system.booking.consumer;

import com.ticket.system.booking.dto.BookingCreatedEvent;
import com.ticket.system.booking.model.BookingStatus;
import com.ticket.system.booking.repository.BookingRepository;
import com.ticket.system.booking.service.BookingService;

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

    private final BookingService bookingService;
    private final StringRedisTemplate redisTemplate;

    public static final String BOOKING_FAILED_QUEUE = "booking.failed.queue";

    @RabbitListener(queues = BOOKING_FAILED_QUEUE)
    @Transactional
    public void consumePaymentFailedEvent(BookingCreatedEvent event) {
        log.error("Recibido evento de pago fallido: {}", event);

        bookingService.cancelBooking(event.getBookingId());
    }
}
