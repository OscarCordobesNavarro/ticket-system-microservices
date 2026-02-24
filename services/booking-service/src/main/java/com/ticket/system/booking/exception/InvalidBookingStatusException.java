package com.ticket.system.booking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class InvalidBookingStatusException extends RuntimeException {
    public InvalidBookingStatusException(Long bookingId, String currentStatus) {
        super("La reserva #" + bookingId + " no puede ser cancelada porque su estado actual es '"
                + currentStatus + "'. Solo se pueden cancelar reservas en estado PENDING.");
    }
}
