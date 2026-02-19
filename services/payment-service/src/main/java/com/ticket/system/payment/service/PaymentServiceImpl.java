package com.ticket.system.payment.service;

import java.util.Random;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import com.ticket.system.payment.config.RabbitMQConfig;
import com.ticket.system.payment.dto.BookingCreatedEvent;

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
        rabbitTemplate.convertAndSend(RabbitMQConfig.BOOKING_EXCHANGE, "payment.success", bookingData);
    }

    // Falla el pago, y enviamos un mensaje de error para cancelar la reserva
    private void handleFailedPayment(BookingCreatedEvent bookingData) {
        log.warn("Pago fallido para la reserva {}", bookingData.getBookingId());
        bookingData.setStatus("FAILURE");
        rabbitTemplate.convertAndSend(RabbitMQConfig.BOOKING_EXCHANGE, "booking.failed", bookingData);
    }
    
}
