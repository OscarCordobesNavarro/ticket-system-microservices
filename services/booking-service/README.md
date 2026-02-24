# 📟 Booking Service

Microservicio central del sistema. Gestiona el **ciclo de vida completo de una reserva** y garantiza que nunca se vendan más entradas de las disponibles mediante control de stock en Redis.

## 📄 Responsabilidades

1. **Crear reserva** — valida evento (Feign→catalog), valida usuario (Feign→user), descuenta stock en Redis y persiste la reserva en `PENDING`.
2. **Consultar reservas** — por ID o por userId (solo el propio usuario puede ver sus reservas).
3. **Cancelar reserva** — solo reservas en estado `PENDING`; devuelve el stock a Redis.
4. **Gestionar stock** — inicializa y consulta el stock de entradas en Redis.
5. **Compensar fallos de pago** — escucha `booking.failed.queue` y cancela la reserva (Saga compensating transaction).

## 🏗️ Arquitectura Interna

```
BookingController
      │
BookingService (interface)
      │
BookingServiceImpl
  ├── BookingRepository (JPA → PostgreSQL)
  ├── RedisTemplate (stock atómico)
  ├── CatalogServiceClient (Feign)
  ├── UserServiceClient (Feign)
  └── RabbitTemplate (publish booking.created)
```

## 🗄️ Modelo `Booking`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Long` | PK autoincremental |
| `eventId` | `Long` | Referencia al catálogo |
| `ticketTypeId` | `Long` | Tipo de entrada |
| `userId` | `Long` | ID del usuario autenticado |
| `quantity` | `Integer` | Entradas solicitadas |
| `status` | `Enum` | `PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED` |
| `expiresAt` | `LocalDateTime` | +10 min desde la creación |

### Migración Flyway
- **`V1__create_bookings_table.sql`** — crea la tabla con tipos correctos (`BIGINT` para `userId` y `ticketTypeId`).

## 💡 Control de Concurrencia (Redis)

Para evitar *race conditions* (dos usuarios comprando la última entrada simultáneamente):

```
DECR booking:stock:{eventId}
  ├─ resultado >= 0 → stock reservado ✅
  └─ resultado < 0  → INCR (compensación) + StockExhausted Exception ❌
```

Redis es monohilo: las operaciones `DECR`/`INCR` son atómicas por diseño.

## 🔒 Seguridad y Autorización

- Autenticación via `GatewayHeaderAuthFilter` — lee `X-User-Id` y `X-User-Name` inyectados por el gateway (no revalida JWT).
- **Autorización por recurso**: el controller verifica que `X-User-Id == userId` del recurso solicitado. Si no coincide → `403 Forbidden`.
- **`InvalidBookingStatusException`** (409 Conflict) — lanzada al intentar cancelar una reserva que no está en `PENDING`.

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/bookings` | ✅ | Crear reserva |
| `GET` | `/api/bookings/{id}` | ✅ | Obtener reserva por ID |
| `GET` | `/api/bookings/user/{userId}` | ✅ | Reservas del usuario |
| `DELETE` | `/api/bookings/{id}` | ✅ | Cancelar reserva (solo PENDING) |
| `PUT` | `/api/bookings/stock` | ✅ | Inicializar stock en Redis |
| `GET` | `/api/bookings/stock/{eventId}` | ✅ | Consultar stock actual |

## 🔄 Rol en la Saga

| Rol | Exchange / Queue | Routing Key |
|---|---|---|
| **Produce** | `booking.exchange` | `booking.created` |
| **Consume** | `booking.failed.queue` | `booking.failed` → cancela y recupera stock |

## 🌐 Feign Clients

- **`CatalogServiceClient`** → `lb://CATALOG-SERVICE` — valida que el evento existe.
- **`UserServiceClient`** → `lb://USER-SERVICE` — valida que el usuario existe.
- **`CustomErrorDecoder`** — mapea errores HTTP de los Feign clients a excepciones tipadas de la aplicación (404 → `EventNotFoundException` / `UserNotFoundException`).

## ⚙️ Variables de Entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` / `DB_PORT` | PostgreSQL host/puerto |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales BD |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Redis |
| `RABBIT_HOST` / `RABBIT_USER` / `RABBIT_PASSWORD` | RabbitMQ |
| `JWT_SECRET` | Clave JWT (compartida con gateway) |
| `EUREKA_HOST` | Eureka Server |
