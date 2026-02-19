package com.ticket.system.booking.config;

import com.ticket.system.booking.exception.EventNotFoundException;

import feign.Response;
import feign.codec.ErrorDecoder;

public class CustomErrorDecoder implements ErrorDecoder {
    
    @Override
    public Exception decode(String methodKey, Response response) {
        return switch (response.status()) {
            case 404 -> new EventNotFoundException("El evento solicitado no existe en el catálogo");
            case 400 -> new RuntimeException("Petición incorrecta al servicio de catálogo");
            default -> new RuntimeException("Error desconocido al comunicarse con el servicio de catálogo");
        };
    }
}
