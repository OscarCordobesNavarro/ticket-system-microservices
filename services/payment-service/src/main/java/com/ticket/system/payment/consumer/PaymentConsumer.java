package com.ticket.system.payment.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.ticket.system.payment.dto.BookingCreatedEvent;
import com.ticket.system.payment.service.PaymentService;


@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentConsumer {

    private final PaymentService paymentService;

    // Nombre de la cola que escucharemos (la definiremos en RabbitMQConfig)
    public static final String BOOKING_PAYMENT_QUEUE = "booking.payment.queue";

    @RabbitListener(queues = BOOKING_PAYMENT_QUEUE)
    public void consumeBookingEvent(BookingCreatedEvent event) {
        log.info("Recibido evento de reserva en el consumidor de pagos: {}", event);
        paymentService.processPayment(event);
    }
}
