package com.ticket.system.booking.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice // Le dice a Spring: "Si algo falla, mírame a mí"
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class) // Captura los errores de tipo Runtime
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "Operación fallida",
                "mensaje", ex.getMessage() // Aquí aparecerá tu "No hay suficientes entradas..."
        ));
    }
}