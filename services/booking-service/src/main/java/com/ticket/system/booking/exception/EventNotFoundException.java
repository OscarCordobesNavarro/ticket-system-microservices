package com.ticket.system.booking.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(Long eventId) {
        super("No se ha encontrado el evento con ID: " + eventId);
    }

    public EventNotFoundException(String message) {
        super(message);
    }
}
