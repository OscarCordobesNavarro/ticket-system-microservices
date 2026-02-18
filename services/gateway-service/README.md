# 🚪 API Gateway Service (Punto de Entrada)

Basado en **Spring Cloud Gateway**, este servicio centraliza todas las comunicaciones externas del sistema en el puerto **8080**.

## 📄 Funcionalidades
1. **Enrutamiento**: Deriva las peticiones al microservicio adecuado basándose en el prefijo de la URL.
2. **Abstracción**: El cliente no necesita saber cuántos servicios existen o en qué puertos corren.
3. **StripPrefix**: Elimina el prefijo del Gateway (ej: `/catalog`) antes de pasar la petición al servicio final para que coincida con sus `@RequestMapping`.

## 📍 Rutas Configuradas
| Path Petición | Microservicio Destino | Nuevo Path Propagado |
| :--- | :--- | :--- |
| `/catalog/**` | `catalog-service` | `/api/events/...` |
| `/booking/**` | `booking-service` | `/api/bookings/...` |

## ⚙️ Integración con Eureka
El Gateway no usa puertos fijos para encontrar los servicios. Utiliza la sintaxis `lb://NOMBRE_SERVICIO`, lo que le permite balancear la carga automáticamente si mañana escalas y levantas 5 instancias de un mismo microservicio.
