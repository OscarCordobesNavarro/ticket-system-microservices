# 📡 Discovery Service (Netflix Eureka)

Servidor de registro de servicios basado en **Netflix Eureka**. Actúa como el directorio de red interno del sistema — todos los microservicios se registran aquí y el API Gateway los descubre para el balanceo de carga.

## 📄 Responsabilidades

1. **Service Registry** — mantiene un registro actualizado de todas las instancias de microservicios activas y sus direcciones IP/puerto.
2. **Heartbeat monitoring** — los servicios envían un pulso cada 30 segundos. Si dejan de enviarlo, Eureka los elimina del registro automáticamente.
3. **Descubrimiento para el Gateway** — el Gateway usa `lb://NOMBRE-SERVICIO` para resolver la dirección real del servicio en tiempo de ejecución.

## 🌐 Panel de Control

```
http://localhost:8761
```

Desde el panel de Eureka puedes ver:
- Qué servicios están registrados y en qué instancias
- Estado de salud (`UP` / `DOWN`)
- Tiempo desde el último heartbeat

## ⚙️ Configuración

```yaml
# No se registra a sí mismo (es el registry, no un cliente)
eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
  server:
    # Arranque instantáneo en dev (no espera sincronización)
    wait-time-in-ms-when-sync-empty: 0
```

## 📋 Servicios registrados

| Nombre en Eureka | Microservicio |
|---|---|
| `USER-SERVICE` | user-service (:8081) |
| `CATALOG-SERVICE` | catalog-service (:8083) |
| `BOOKING-SERVICE` | booking-service (:8082) |
| `PAYMENT-SERVICE` | payment-service |
| `NOTIFICATION-SERVICE` | notification-service |
| `GATEWAY-SERVICE` | gateway-service (:8080) |
