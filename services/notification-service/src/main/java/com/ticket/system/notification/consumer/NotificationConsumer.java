package com.ticket.system.notification.consumer;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Slf4j
public class NotificationConsumer {

    @RabbitListener(queues = "notification.queue")
    public void consumeNotification(Map<String, Object> event) {
        log.info("**************************************************");
        log.info("¡NOTIFICACIÓN ENVIADA!");
        log.info("Usuario: {}", event.get("userId"));
        log.info("Reserva ID: {}", event.get("bookingId"));
        log.info("Mensaje: Su pago ha sido confirmado. ¡Disfrute del evento!");
        log.info("**************************************************");
    }
}