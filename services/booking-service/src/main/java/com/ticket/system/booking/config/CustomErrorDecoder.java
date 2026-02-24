package com.ticket.system.booking.config;

import com.ticket.system.booking.exception.EventNotFoundException;
import com.ticket.system.booking.exception.UserNotFoundException;

import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Registra un ErrorDecoder personalizado para los clientes Feign.
 * Sin este @Configuration/@Bean, Feign usa su decoder por defecto
 * y los errores 404/400 de servicios externos llegan como excepciones
 * genéricas sin el tipo correcto, rompiendo el GlobalExceptionHandler.
 */
@Configuration
public class CustomErrorDecoder {

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> decode(methodKey, response);
    }

    private Exception decode(String methodKey, Response response) {
        if (response.status() == 404) {
            if (methodKey.contains("EventClient")) {
                return new EventNotFoundException("El evento solicitado no existe en el catálogo");
            }
            if (methodKey.contains("UserClient")) {
                return new UserNotFoundException(0L);
            }
        }

        return switch (response.status()) {
            case 400 -> new RuntimeException("Petición incorrecta al servicio externo");
            case 503 -> new RuntimeException("El servicio externo no está disponible temporalmente");
            default -> new RuntimeException("Error desconocido al comunicarse con el servicio externo (HTTP "
                    + response.status() + ")");
        };
    }
}

