# 🎫 Catalog Service

Fuente de verdad para los **eventos disponibles** en el sistema. Expone la información de conciertos y gestiona la validación de existencia de eventos para otros microservicios.

## 📄 Responsabilidades

1. **CRUD de eventos** — gestiona el catálogo completo de conciertos y eventos.
2. **Validación interna** — el Booking Service lo consulta via Feign antes de crear una reserva.

## 🔒 Seguridad

Utiliza `GatewayHeaderAuthFilter` — lee `X-User-Id` y `X-User-Name` del header inyectado por el Gateway. No valida JWT directamente (autenticación centralizada en Gateway).

- Rutas públicas: `GET /api/events` y `GET /api/events/{id}` (catálogo público)
- Rutas protegidas: `POST /api/events` (requiere autenticación)

## 🗄️ Modelo `Event`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Long` | PK autoincremental |
| `artist` | `String` | Nombre del artista o grupo |
| `name` | `String` | Nombre del tour o evento |
| `venue` | `String` | Recinto (estadio, teatro, sala) |
| `date` | `LocalDateTime` | Fecha y hora del evento |
| `description` | `String` | Detalles adicionales |
| `imageUrl` | `String` | URL de imagen del evento |
| `ticketTypes` | `List<TicketType>` | Tipos de entrada disponibles |

## 📡 Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/events` | ❌ | Todos los eventos |
| `GET` | `/api/events/{id}` | ❌ | Detalle de un evento |
| `POST` | `/api/events` | ✅ | Crear nuevo evento |
| `PUT` | `/api/events/{id}` | ✅ | Actualizar evento |
| `DELETE` | `/api/events/{id}` | ✅ | Eliminar evento |

## 🔌 Consumido por

El **Booking Service** consulta `GET /api/events/{id}` via `CatalogServiceClient` (OpenFeign) antes de crear una reserva para:
- Verificar que el evento existe (404 → `EventNotFoundException`)
- Obtener datos del evento para el payload del evento de dominio

## ⚙️ Variables de Entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` / `DB_PORT` | PostgreSQL host/puerto |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales BD |
| `EUREKA_HOST` | Eureka Server |
