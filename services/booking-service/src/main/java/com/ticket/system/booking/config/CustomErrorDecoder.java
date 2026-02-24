package com.ticket.system.booking.config;

import com.ticket.system.booking.exception.EventNotFoundException;
import com.ticket.system.booking.exception.UserNotFoundException;

import feign.Response;
import feign.codec.ErrorDecoder;

public class CustomErrorDecoder implements ErrorDecoder {
    
    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == 404) {
            if (methodKey.contains("EventClient")) {
                return new EventNotFoundException("El evento solicitado no existe en el catálogo");
            }
            if (methodKey.contains("UserClient")) {
                return new UserNotFoundException(0L); // El ID es simbólico aquí
            }
        }
        
        return switch (response.status()) {
            case 400 -> new RuntimeException("Petición incorrecta al servicio externo");
            default -> new RuntimeException("Error desconocido al comunicarse con el servicio externo");
        };
    }
}
