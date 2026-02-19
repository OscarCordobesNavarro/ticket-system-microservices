package com.ticket.system.booking.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockResponseDTO {
    private Long eventId;
    private Integer quantity;
    private String message;
    private LocalDateTime updatedAt;
}
