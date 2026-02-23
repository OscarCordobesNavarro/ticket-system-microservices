package com.ticket.system.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private Long bookingId;
    private String userId;
    private Long eventId;
    private Long ticketTypeId;
    private Integer quantity;
    private String status;
    private String message;
}
