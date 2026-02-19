package com.ticket.system.notification.consumer;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

import com.ticket.system.notification.dto.NotificationEvent;
import com.ticket.system.notification.service.NotificationService;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = "notification.queue")
    public void consumeNotification(NotificationEvent event) {
        log.info("Evento recibido en notificaciones: {}", event.getBookingId());

        if ("SUCCESS".equals(event.getStatus())) {
            notificationService.sendSuccessNotification(event);
        } else {
            notificationService.sendFailureNotification(event);
        }
    }
}