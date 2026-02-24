package com.ticket.system.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Configuración de Spring Security para el Gateway.
 *
 * IMPORTANTE: La autenticación real se realiza en JwtAuthenticationFilter (GlobalFilter).
 * Este SecurityConfig solo existe para deshabilitar el comportamiento por defecto de
 * Spring Security WebFlux (que bloquea con 403 por CSRF y requiere autenticación para todo),
 * ya que la validación JWT la gestionamos nosotros mismos como GlobalFilter.
 */
@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            // Deshabilitar CSRF: el gateway es una API stateless,
            // no usa sesiones ni cookies de sesión.
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            // Permitir todas las peticiones: la autenticación/autorización
            // la gestiona nuestro JwtAuthenticationFilter personalizado.
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().permitAll()
            );

        return http.build();
    }
}
