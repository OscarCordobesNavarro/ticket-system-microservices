# 🔔 Notification Service

El punto final del flujo de usuario exitoso.

## 📄 Responsabilidades
1. Escuchar los eventos de pago completado.
2. Simular la emisión de un ticket digital al usuario.

## 📡 Consumer
Escucha la cola `notification.queue`, la cual está enlazada al Exchange global con la clave `payment.success`.

Al recibir el mensaje, el servicio genera un log visual con información detallada de la reserva para confirmar que el ciclo de vida del microservicio se ha cerrado satisfactoriamente.
