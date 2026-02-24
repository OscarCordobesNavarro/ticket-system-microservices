package com.ticket.system.payment.service;

import java.util.Random;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.ticket.system.payment.config.RabbitMQConfig;
import com.ticket.system.payment.dto.BookingCreatedEvent;
import com.ticket.system.payment.dto.NotificationEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final RabbitTemplate rabbitTemplate;
    private final Random random = new Random();

    @Override
    public void processPayment(BookingCreatedEvent bookingData) {
        Long bookingId = bookingData.getBookingId();
        log.info("Iniciando procesamiento de pago para la reserva {}", bookingId);

        // Simular procesamiento de pago con una probabilidad de éxito del 80%
        try {
            Thread.sleep(2000); // Simular tiempo de procesamiento
            boolean paymentSuccess = random.nextInt(100) < 80; // 80% de éxito
            if (paymentSuccess) {
                handleSuccessfulPayment(bookingData);
            } else {
                handleFailedPayment(bookingData);
            }
        } catch (InterruptedException e) {
            log.error("Error durante el procesamiento del pago para la reserva {}", bookingId, e);
            Thread.currentThread().interrupt();
        }
    }

    private void handleSuccessfulPayment(BookingCreatedEvent bookingData) {
        log.info("Pago exitoso para la reserva {}", bookingData.getBookingId());

        bookingData.setStatus("SUCCESS");
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EXCHANGE,
                RabbitMQConfig.PAYMENT_SUCCESS_ROUTING_KEY,
                bookingData
        );

        NotificationEvent notificationEvent = buildNotificationEvent(bookingData, "SUCCESS",
                "¡Tu pago ha sido procesado con éxito! Tu reserva está confirmada. ¡Nos vemos en el evento!");
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notificationEvent
        );

        log.info("Eventos publicados: pago confirmado y notificación de éxito para reserva {}",
                bookingData.getBookingId());
    }

    private void handleFailedPayment(BookingCreatedEvent bookingData) {
        log.warn("Pago fallido para la reserva {}", bookingData.getBookingId());

        bookingData.setStatus("FAILURE");
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EXCHANGE,
                RabbitMQConfig.BOOKING_FAILED_ROUTING_KEY,
                bookingData
        );

        NotificationEvent notificationEvent = buildNotificationEvent(bookingData, "FAILURE",
                "Lo sentimos, no hemos podido procesar tu pago. Tu reserva ha sido liberada. Por favor, inténtalo de nuevo.");
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.BOOKING_EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                notificationEvent
        );

        log.info("Eventos publicados: reserva cancelada y notificación de fallo para reserva {}",
                bookingData.getBookingId());
    }

    private NotificationEvent buildNotificationEvent(BookingCreatedEvent bookingData,
                                                      String status, String message) {
        return NotificationEvent.builder()
                .bookingId(bookingData.getBookingId())
                .userId(bookingData.getUserId())
                .eventId(bookingData.getEventId())
                .ticketTypeId(bookingData.getTicketTypeId())
                .quantity(bookingData.getQuantity())
                .status(status)
                .message(message)
                .build();
    }
}
