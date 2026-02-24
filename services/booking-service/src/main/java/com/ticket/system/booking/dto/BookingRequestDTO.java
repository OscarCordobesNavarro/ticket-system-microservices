package com.ticket.system.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequestDTO {
    @NotNull(message = "El ID del evento es obligatorio")
    private Long eventId;
    @NotNull(message = "El ID del tipo de entrada es obligatorio")
    private Long ticketTypeId;
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long userId;
    @Min(value = 1, message = "La cantidad de entradas debe ser al menos 1")
    private Integer quantity;
}
