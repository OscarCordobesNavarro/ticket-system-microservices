# 💰 Payment Service

Simula una **pasarela de pagos asíncrona** dentro de la Saga de reservas. Opera exclusivamente via mensajería RabbitMQ, sin endpoints HTTP expuestos al exterior.

## 📄 Responsabilidades

1. **Consumir** eventos `booking.created` — inicia el proceso de cobro.
2. **Simular** el procesamiento bancario con latencia y probabilidad de fallo.
3. **Publicar** el resultado al bus de eventos para que el resto de la Saga reaccione.

## 🎲 Lógica de Simulación

```java
// Simula latencia bancaria
Thread.sleep(2000);

// Resultado probabilístico
if (Math.random() < 0.8) {
    // 80% éxito → publica payment.success
} else {
    // 20% fallo → publica booking.failed (activa compensación)
}
```

Esta aleatoriedad permite probar automáticamente el flujo feliz y las compensating transactions de la Saga.

## 📡 Comunicación RabbitMQ

| Rol | Queue / Routing Key | Descripción |
|---|---|---|
| **Consume** | `booking.payment.queue` bound a `booking.created` | Recibe reservas para procesar |
| **Produce (éxito)** | `payment.success` | Notifica pago completado → notification-service |
| **Produce (fallo)** | `booking.failed` | Notifica fallo → booking-service cancela la reserva |

## 📦 Eventos

### Entrada: `BookingCreatedEvent`
```json
{
  "bookingId": 123,
  "eventId": 45,
  "userId": 7,
  "quantity": 2
}
```

### Salida: `NotificationEvent` (en éxito)
```json
{
  "bookingId": 123,
  "userId": 7,
  "eventId": 45,
  "quantity": 2,
  "status": "CONFIRMED"
}
```

## ⚙️ Variables de Entorno

| Variable | Descripción |
|---|---|
| `RABBIT_HOST` / `RABBIT_PORT` | RabbitMQ host/puerto |
| `RABBIT_USER` / `RABBIT_PASSWORD` | Credenciales RabbitMQ |
| `EUREKA_HOST` | Eureka Server |
