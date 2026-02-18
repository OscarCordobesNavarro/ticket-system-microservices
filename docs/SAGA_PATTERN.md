# ⚔️ Patrón Saga: Gestión de Transacciones Distribuidas

En una arquitectura de microservicios, no existe una sola base de datos central. Si un usuario reserva un ticket pero el pago falla, no podemos simplemente hacer un `ROLLBACK` de SQL convencional. Necesitamos una **Transacción Larga**.

## 🩰 Tipo: Saga por Coreografía
Hemos implementado la Saga mediante **Coreografía**. Esto significa que no hay un "jefe" central, sino que cada microservicio sabe qué evento debe disparar su lógica.

### 📍 Paso 1: Reserva (Origen)
- **Servicio**: `booking-service`
- **Acción**: Restar stock en Redis y crear registro en Postgres.
- **Evento Emitido**: `booking.created` (Routing Key)

### 📍 Paso 2: Pago (Procesamiento)
- **Servicio**: `payment-service`
- **Acción**: Simula una transacción bancaria.
- **Resultados posibles**:
   - **OK**: Emite `payment.success` -> Finaliza el flujo.
   - **Error**: Emite `payment.failed` -> Dispara la compensación.

### 📍 Paso 3: Compensación (Rollback)
- **Servicio**: `booking-service` (Escuchando `booking.failed`)
- **Lógica de Compensación**:
    1. Buscar la reserva por ID.
    2. Cambiar estado a `CANCELLED`.
    3. **Devolución de Stock**: Sumar de nuevo las entradas a Redis (`redis.increment`).
- **Importancia**: Este paso garantiza que el catálogo de entradas siempre sea correcto, incluso tras fallos inesperados.

## 🧠 Ventajas de este enfoque
1. **Bajo Acoplamiento**: El servicio de Pago no necesita saber cómo devolver el stock; solo grita "¡El pago falló!".
2. **Escalabilidad**: El sistema no se bloquea esperando una respuesta de la base de datos de otro servicio.
3. **Resiliencia**: Si el servicio de notificaciones está caído, el pago y la reserva siguen funcionando, y la notificación se entregará cuando el servicio vuelva (gracias a las colas de RabbitMQ).
