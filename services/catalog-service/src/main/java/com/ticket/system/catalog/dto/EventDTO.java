package com.ticket.system.catalog.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ticket.system.catalog.model.EventStatus;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String name;

    @NotBlank(message = "El artista es obligatorio")
    private String artist;

    @NotBlank(message = "El lugar del evento es obligatorio")
    private String venue;

    @NotNull(message = "La fecha es obligatoria")
    @Future(message = "La fecha debe ser en el futuro")
    private LocalDateTime date;

    private String description;

    private java.util.List<TicketTypeDTO> ticketTypes;
    private String imageUrl;

    @NotNull(message = "El estado del evento es obligatorio")
    private EventStatus status;
}
