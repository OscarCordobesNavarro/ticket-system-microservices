package com.ticket.system.notification.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.ticket.system.notification.dto.NotificationEvent;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendSuccessNotification(NotificationEvent data) {
        String userId = data.getUserId();
        String bookingId = data.getBookingId().toString();
        log.info("📧 ENVIANDO EMAIL DE ÉXITO A: {}", userId);
        log.info("**************************************************");
        log.info("Asunto: ¡Tu entrada ya está lista!");
        log.info("Reserva #{} CONFIRMADA", bookingId);
        log.info("Mensaje: Tu pago ha sido procesado con éxito. ¡Nos vemos en el evento!");
        log.info("**************************************************");
    }

    @Override
    public void sendFailureNotification(NotificationEvent data) {
        String userId = data.getUserId();
        String bookingId = data.getBookingId().toString();
        log.warn("📧 ENVIANDO EMAIL DE FALLO A: {}", userId);
        log.info("**************************************************");
        log.info("Asunto: Problema con tu reserva");
        log.info("Reserva #{} CANCELADA", bookingId);
        log.info("Mensaje: Lo sentimos, no hemos podido procesar tu pago. Tu reserva ha sido liberada.");
        log.info("**************************************************");
    }

}
