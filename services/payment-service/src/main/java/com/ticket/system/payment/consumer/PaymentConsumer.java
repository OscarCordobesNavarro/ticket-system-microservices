package com.ticket.system.payment.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentConsumer {

    private final RabbitTemplate rabbitTemplate;
    private final Random random = new Random();

    // Nombre de la cola que escucharemos (la definiremos en RabbitMQConfig)
    public static final String BOOKING_PAYMENT_QUEUE = "booking.payment.queue";

    @RabbitListener(queues = BOOKING_PAYMENT_QUEUE)
    public void consumeBookingEvent(Map<String, Object> event) {
        log.info("Recibido evento de reserva: {}", event);

        Long bookingId = Long.valueOf(event.get("bookingId").toString());

        try {
            // Simulamos proceso de pago (2 segundos)
            Thread.sleep(2000);

            // 80% éxito, 20% fallo
            boolean isSuccess = random.nextInt(100) < 80;

            if (isSuccess) {
                log.info("Pago EXITOSO para la reserva {}", bookingId);
                // Aquí enviaríamos un evento de PAGO_COMPLETADO si quisiéramos
                Map<String, Object> successEvent = Map.of(
                        "bookingId", bookingId,
                        "userId", event.get("userId"),
                        "eventId", event.get("eventId"),
                        "status", "CONFIRMED");
                rabbitTemplate.convertAndSend("booking.exchange", "payment.success", successEvent);
            } else {
                log.error("Pago FALLIDO para la reserva {}", bookingId);

                // Enviamos evento de compensación (Saga)
                Map<String, Object> compensationEvent = Map.of(
                        "bookingId", bookingId,
                        "eventId", event.get("eventId"),
                        "quantity", event.get("quantity"),
                        "reason", "PAYMENT_FAILED");

                rabbitTemplate.convertAndSend("booking.exchange", "booking.failed", compensationEvent);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
