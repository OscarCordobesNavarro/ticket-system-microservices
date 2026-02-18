# 💰 Payment Service

Simula una pasarela de pagos asíncrona dentro del ecosistema de microservicios.

## 📄 Responsabilidades
1. Recibir solicitudes de pago desde el bus de eventos.
2. Confirmar o rechazar la transacción mediante una simulación probabilística.

## 🎲 Lógica de Simulación
El servicio está programado para ser 100% automático:
- Al recibir un `booking.created`, espera **2 segundos** para simular la latencia de un banco externo.
- Existe una probabilidad del **80% de éxito** y **20% de fallo**.
- Esta aleatoriedad permite probar las acciones de compensación de la Saga automáticamente.

## 📡 Comunicación (RabbitMQ)
- **Escucha**: `booking.payment.queue` bound to `booking.created`.
- **Emite (Éxito)**: `payment.success` (Routing Key).
- **Emite (Fallo)**: `booking.failed` (Routing Key).
