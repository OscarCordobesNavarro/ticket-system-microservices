package com.ticket.system.gateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.security.Key;
import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final List<String> OPEN_PATHS = List.of(
            "/user/api/auth/register",
            "/user/api/auth/login",
            "/user/api/users/validate",
            "/catalog/v3/api-docs",
            "/booking/v3/api-docs",
            "/user/v3/api-docs"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().toString();

        // Permitir rutas públicas sin validación
        boolean isOpenPath = OPEN_PATHS.stream().anyMatch(path::startsWith);
        if (isOpenPath) {
            log.debug("Ruta pública, sin validación JWT: {}", path);
            return chain.filter(exchange);
        }

        // Extraer el token del header Authorization
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Petición sin token JWT a ruta protegida: {}", path);
            return unauthorizedResponse(exchange, "Token de autenticación requerido");
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = extractAllClaims(token);
            String username = claims.getSubject();
            Long userId = claims.get("userId", Long.class);

            log.debug("JWT válido para usuario '{}' (ID: {}) en ruta: {}", username, userId, path);

            // Propagar identidad del usuario como cabeceras internas hacia los microservicios
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", String.valueOf(userId))
                    .header("X-User-Name", username)
                    .build();

            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (ExpiredJwtException e) {
            log.warn("JWT expirado para ruta: {}", path);
            return unauthorizedResponse(exchange, "El token ha expirado");
        } catch (MalformedJwtException | SecurityException e) {
            log.warn("JWT inválido para ruta: {}", path);
            return unauthorizedResponse(exchange, "Token inválido");
        } catch (Exception e) {
            log.error("Error al procesar el JWT para ruta: {}", path, e);
            return unauthorizedResponse(exchange, "Error al procesar el token");
        }
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        var buffer = exchange.getResponse().bufferFactory()
                .wrap(("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}").getBytes());
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public int getOrder() {
        // Se ejecuta antes que cualquier otro filtro de rutas
        return -1;
    }
}
