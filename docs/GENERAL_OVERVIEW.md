# 🌐 Arquitectura General del Sistema de Tickets

Este sistema ha sido diseñado bajo los principios de **Microservicios Cloud-Native**, con el objetivo de manejar cargas masivas de tráfico típicas en eventos de alta demanda. No es un simple CRUD; es un ecosistema distribuido que garantiza la integridad de los datos sin sacrificar la escalabilidad.

## 📐 Topología de la Red
Toda la comunicación interna ocurre dentro de una red virtual de Docker (`ticket-network`). Los servicios no necesitan conocer las direcciones IP de sus vecinos, ya que utilizan **Nombres de Servicio** (DNS interno de Docker) y **Eureka** para encontrarse.

### Componentes de Infraestructura (Core)
Para una visión detallada, consulta el [Mapa de Componentes](./DIAGRAMS.md#1-mapa-de-componentes-infraestructura).
1. **Eureka Discovery Server**: El directorio telefónico. Cada microservicio se registra aquí al arrancar.
2. **API Gateway**: El portero del sistema. Todas las peticiones del mundo exterior (Frontend/Mobile) entran por el puerto 8080.
3. **RabbitMQ**: El sistema nervioso. Permite que los servicios se comuniquen de forma asíncrona sin bloquearse entre sí.
4. **PostgreSQL**: Persistencia relacional. Cada servicio tiene su propia "parcela" de datos.
5. **Redis**: La memoria de corto plazo. Usada para bloqueos atómicos de stock que requieren milisegundos de respuesta.

## 🔄 Flujo de una Petición (End-to-End)
Consulta el [Diagrama de Secuencia Exitoso](./DIAGRAMS.md#2-diagrama-de-secuencia-flujo-exitoso).

## 🚀 Tecnologías Utilizadas
- **Lenguaje**: Java 21 (LTS)
- **Framework**: Spring Boot 3.4.2 & Spring Cloud 2024.0.0
- **Seguridad (Planificada)**: Spring Security + JWT
- **Persistencia**: Spring Data JPA / Hibernate
- **Mensajería**: Spring AMQP (RabbitMQ)
- **Despliegue**: Docker & Docker Compose
- **Documentación**: SpringDoc OpenAPI (SwaggerUI)
