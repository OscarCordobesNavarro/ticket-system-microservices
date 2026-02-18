# 📡 Discovery Service (Netflix Eureka)

El cerebro de la red. Este servicio centraliza el registro de todos los microservicios.

## 📄 Responsabilidades
1. **Service Registry**: Mantiene una lista viva de qué servicios están "UP" y en qué IP se encuentran.
2. **Heartbeat**: Los servicios envían una señal cada 30 segundos. Si dejan de enviarla, Eureka los elimina de la lista para evitar errores 404 en el Gateway.

## 📡 Panel de Control
Al arrancar el sistema, puedes ver el estado de salud de toda la red entrando en:
`http://localhost:8761`

## ⚙️ Configuración
El servidor está configurado para no registrarse a sí mismo (`register-with-eureka: false`) y para no esperar tiempos de sincronización en local (`wait-time-in-ms-when-sync-empty: 0`), lo que permite un arranque mucho más rápido en entornos de desarrollo.
