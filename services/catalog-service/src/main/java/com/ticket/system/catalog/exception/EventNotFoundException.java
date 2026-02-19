package com.ticket.system.catalog.exception;

public class EventNotFoundException extends RuntimeException {
    public EventNotFoundException(Long id) {
        super("El evento con ID " + id + " no existe en nuestro catálogo.");
    }
}