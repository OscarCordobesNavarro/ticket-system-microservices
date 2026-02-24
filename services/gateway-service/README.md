# 🚪 API Gateway Service

Punto de entrada único del sistema, basado en **Spring Cloud Gateway** (WebFlux reactivo). Expuesto en el puerto **8080**.

## 📄 Responsabilidades

1. **Autenticación JWT centralizada** — valida el token en cada petición antes de routear al servicio destino. Los servicios internos confían en los headers inyectados por el gateway, nunca revalidan el JWT.
2. **Rate Limiting** — protección contra abuso y ataques DoS mediante algoritmo *Token Bucket* gestionado en Redis.
3. **Enrutamiento inteligente** — descubre los servicios disponibles via Eureka (`lb://`) y elimina el prefijo de ruta antes de reenviar (`StripPrefix=1`).
4. **CORS centralizado** — maneja los headers CORS para el frontend React en `localhost:5173`.
5. **Swagger UI agregado** — sirve la documentación de todos los microservicios desde una única URL.

## 🔒 Flujo de Autenticación JWT

```
Petición entrante
  │
  ├─ ¿Está en OPEN_PATHS? (/user/api/auth/login, /user/api/auth/register...)
  │     └─ SÍ → pasa directamente al servicio destino
  │
  └─ NO → extrae Bearer token del header Authorization
              ├─ Token válido → inyecta X-User-Id y X-User-Name en la request
              │                 y enruta al servicio
              └─ Token inválido/ausente → 401 Unauthorized
```

Los servicios destino leen `X-User-Id` y `X-User-Name` mediante su `GatewayHeaderAuthFilter` local.

## 🚦 Rate Limiter por Servicio

| Servicio | Replenish Rate | Burst Capacity |
|---|---|---|
| `catalog-service` | 2 req/s | 10 |
| `booking-service` | 1 req/s | 2 |
| `user-service` | 5 req/s | 20 |

- **KeyResolver**: dirección IP remota (`RemoteAddrKeyResolver`)
- **Respuesta al exceder**: `429 Too Many Requests` (con retry automático 1s en el frontend)

## 📍 Rutas Configuradas

| Prefijo entrante | Servicio destino | Ruta efectiva |
|---|---|---|
| `/catalog/**` | `lb://CATALOG-SERVICE` | `/**` (StripPrefix=1) |
| `/booking/**` | `lb://BOOKING-SERVICE` | `/**` (StripPrefix=1) |
| `/user/**` | `lb://USER-SERVICE` | `/**` (StripPrefix=1) |

## ⚠️ Spring Security en Gateway (WebFlux)

`springdoc-openapi-starter-webflux-ui` trae Spring Security como dependencia transitiva. Sin configuración explícita, la auto-configuración reactiva habilita CSRF, bloqueando todos los POST con 403.

Se ha añadido un `SecurityConfig` que:
- Deshabilita CSRF (API stateless, sin sesiones)
- Permite todos los exchanges (`anyExchange().permitAll()`)

La autenticación real la gestiona el `JwtAuthenticationFilter` (GlobalFilter, order=-1).

## 🌐 Swagger UI Centralizado

```
http://localhost:8080/swagger-ui.html
```

Agrega la documentación OpenAPI de:
- **Catalog Service** → `/catalog/v3/api-docs`
- **Booking Service** → `/booking/v3/api-docs`
- **User Service** → `/user/v3/api-docs`
