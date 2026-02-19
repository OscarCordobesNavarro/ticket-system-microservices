package com.ticket.system.notification.service;

import com.ticket.system.notification.dto.NotificationEvent;

public interface NotificationService {
    void sendSuccessNotification(NotificationEvent data);
    void sendFailureNotification(NotificationEvent data);
}
