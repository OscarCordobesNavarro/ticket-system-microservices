# 🔔 Notification Service

Último eslabón del flujo de usuario exitoso. Recibe la confirmación de pago y simula el **envío de la entrada digital** al usuario.

## 📄 Responsabilidades

1. **Consumir** eventos `payment.success` desde RabbitMQ.
2. **Generar** un log estructurado que simula el envío del ticket digital.

> En un entorno de producción, este servicio integraría un proveedor de email (SendGrid, AWS SES) o un sistema de generación de PDFs. Por ahora genera logs detallados para confirmar que el ciclo completo de la Saga se ha cerrado.

## 📡 Comunicación RabbitMQ

| Rol | Queue | Routing Key | Exchange |
|---|---|---|---|
| **Consume** | `notification.queue` | `payment.success` | `booking.exchange` |

## 📦 Evento consumido: `NotificationEvent`

```json
{
  "bookingId": 123,
  "userId": 7,
  "eventId": 45,
  "quantity": 2,
  "status": "CONFIRMED"
}
```

## 📋 Log generado

Al recibir el evento, el servicio genera un log del tipo:

```
🎟️ TICKET ENVIADO
  Reserva #123 — Usuario #7
  Evento #45 — 2 entrada(s)
  Estado: CONFIRMED
```

## ⚙️ Variables de Entorno

| Variable | Descripción |
|---|---|
| `RABBIT_HOST` / `RABBIT_PORT` | RabbitMQ host/puerto |
| `RABBIT_USER` / `RABBIT_PASSWORD` | Credenciales RabbitMQ |
| `EUREKA_HOST` | Eureka Server |
