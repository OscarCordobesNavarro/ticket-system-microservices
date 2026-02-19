# 📟 Booking Service (Corazón del Sistema)

Este microservicio gestiona el ciclo de vida de una reserva de entradas. Su responsabilidad principal es garantizar que nunca se vendan más entradas de las disponibles.

## 🛠️ Stack Tecnológico Específico
- **Spring Data Redis**: Gestión de stock mediante operaciones atómicas.
- **Spring Data JPA**: Persistencia de reservas.
- **Spring AMQP**: Emisión de eventos de creación y recepción de eventos de fallo.

## 💡 Lógica de Concurrencia (Redis Critical Section)
Para evitar el "Race Condition" (dos personas comprando la última entrada al mismo tiempo), el servicio utiliza el comando `DECR` de Redis.
- Redis es monohilo, por lo que las operaciones de resta son secuenciales y seguras.
- Si el stock baja de cero, se rehace la operación (`INCR`) y se lanza una excepción de negocio.

## 📁 Estructura del Modelo
| Campo | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | Long | ID Autogenerado. |
| `eventId` | Long | Referencia al catálogo de eventos. |
| `userId` | String | ID del usuario (desacoplado de un microservicio de usuarios). |
| `quantity` | Integer | Cantidad de tickets solicitados. |
| `status` | Enum | `PENDING`, `CONFIRMED`, `CANCELLED`, `EXPIRED`. |
| `expiresAt` | DateTime| Tiempo límite para pagar (10 min). |

## 📡 Endpoints
- `POST /api/bookings`: Crea una reserva con los parámetros `eventId`, `userId`, `quantity`. Devuelve `BookingResponseDTO`.
- `PUT /api/bookings/stock`: Endpoint administrativo para definir el stock inicial en Redis. **Ahora devuelve un `StockResponseDTO` tras validar el evento**.
- `GET /api/bookings/stock/{eventId}`: Consulta en tiempo real las entradas que quedan en Redis.

## 🔄 Rol en la Saga
- **Productor**: Envía `booking.created` al Exchange `booking.exchange`.
- **Consumidor**: Escucha la cola `booking.failed.queue` para cancelar reservas fallidas (Compensating Transaction).
