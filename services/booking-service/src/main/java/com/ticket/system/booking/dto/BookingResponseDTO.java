package com.ticket.system.booking.dto;

import java.time.LocalDateTime;

import com.ticket.system.booking.model.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDTO {
    private Long id;
    private Long eventId;
    private Long ticketTypeId;
    private Long userId;
    private Integer quantity;
    private BookingStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
