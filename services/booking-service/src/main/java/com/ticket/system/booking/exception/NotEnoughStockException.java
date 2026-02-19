package com.ticket.system.booking.exception;

public class NotEnoughStockException extends RuntimeException {
    public NotEnoughStockException(Integer remainingStock) {
        super("No hay suficiente stock disponible. Stock restante: " + remainingStock);
    }
    
}
