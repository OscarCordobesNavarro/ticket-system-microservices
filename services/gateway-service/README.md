# 🚪 API Gateway Service (Punto de Entrada)

Basado en **Spring Cloud Gateway**, este servicio centraliza todas las comunicaciones externas del sistema en el puerto **8080**.

## 📄 Funcionalidades
1. **Enrutamiento**: Deriva las peticiones al microservicio adecuado basándose en el prefijo de la URL.
2. **Rate Limiting**: Protección contra ataques de denegación de servicio (DoS) o abuso de la API mediante un algoritmo de **Token Bucket** gestionado por Redis.
3. **Abstracción**: El cliente no necesita saber cuántos servicios existen o en qué puertos corren.
4. **StripPrefix**: Elimina el prefijo del Gateway (ej: `/catalog`) antes de pasar la petición al servicio final.

## 🚦 Configuración del Rate Limiter
El sistema utiliza **Redis** para mantener el estado del limitador de forma distribuida.
- **KeyResolver**: Identifica a cada usuario por su dirección IP (`RemoteAddrKeyResolver`).
- **Replenish Rate**: Cuántas fichas (peticiones) se añaden al "cubo" por segundo.
- **Burst Capacity**: Capacidad máxima del "cubo" para permitir ráfagas puntuales.
- **Respuesta**: Cuando se excede el límite, el Gateway devuelve un error **429 Too Many Requests**.

## 📍 Rutas Configuradas
...
(el resto de la tabla)

## ⚙️ Integración con Eureka
...
