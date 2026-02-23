package com.ticket.system.booking.consumer;

import com.ticket.system.booking.config.RabbitMQConfig;
import com.ticket.system.booking.dto.BookingCreatedEvent;
import com.ticket.system.booking.service.BookingService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingConsumer {

    private final BookingService bookingService;

    public static final String BOOKING_FAILED_QUEUE = "booking.failed.queue";

    @RabbitListener(queues = RabbitMQConfig.BOOKING_FAILED_QUEUE)
    @Transactional
    public void consumePaymentFailedEvent(BookingCreatedEvent event) {
        log.error("Recibido evento de pago fallido: {}", event);
        bookingService.cancelBooking(event.getBookingId());
    }

    @RabbitListener(queues = RabbitMQConfig.PAYMENT_SUCCESS_QUEUE)
    @Transactional
    public void consumePaymentSuccessEvent(BookingCreatedEvent event) {
        log.info("Recibido evento de pago exitoso: {}", event);
        bookingService.confirmBooking(event.getBookingId());
    }
}
