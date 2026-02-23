package com.ticket.system.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreatedEvent {
    private Long bookingId;
    private Long eventId;
    private Long ticketTypeId;
    private Integer quantity;
    private String userId;
    private String status;
}
