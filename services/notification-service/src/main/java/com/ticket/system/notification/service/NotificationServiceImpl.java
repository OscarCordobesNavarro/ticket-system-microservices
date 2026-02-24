package com.ticket.system.notification.service;

import org.springframework.stereotype.Service;

import com.ticket.system.notification.dto.NotificationEvent;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendSuccessNotification(NotificationEvent data) {
        log.info("**************************************************");
        log.info("📧 SIMULANDO ENVÍO DE EMAIL → Usuario ID: {}", data.getUserId());
        log.info("   Asunto: ¡Tu entrada ya está lista! 🎉");
        log.info("   Reserva #{} — CONFIRMADA ✅", data.getBookingId());
        log.info("   Evento ID: {} | Tipo de entrada ID: {} | Cantidad: {}",
                data.getEventId(), data.getTicketTypeId(), data.getQuantity());
        log.info("   Mensaje: {}", data.getMessage());
        log.info("**************************************************");
    }

    @Override
    public void sendFailureNotification(NotificationEvent data) {
        log.warn("**************************************************");
        log.warn("📧 SIMULANDO ENVÍO DE EMAIL → Usuario ID: {}", data.getUserId());
        log.warn("   Asunto: Problema con tu reserva ⚠️");
        log.warn("   Reserva #{} — CANCELADA ❌", data.getBookingId());
        log.warn("   Evento ID: {} | Tipo de entrada ID: {} | Cantidad: {}",
                data.getEventId(), data.getTicketTypeId(), data.getQuantity());
        log.warn("   Mensaje: {}", data.getMessage());
        log.warn("**************************************************");
    }
}
