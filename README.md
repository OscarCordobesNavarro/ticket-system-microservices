# 🎫 Ticket System Microservices

Sistema distribuido de alto rendimiento para la reserva y venta de entradas en eventos de alta demanda. Implementado con una arquitectura de microservicios robusta, asíncrona y escalable.

## 🚀 Características Principales
- **Arquitectura Event-Driven**: Comunicación asíncrona mediante RabbitMQ.
- **Transacciones Distribuidas**: Implementación del **Patrón Saga (Coreografía)** para asegurar la consistencia.
- **Alta Concurrencia**: Gestión de stock atómica con **Redis** para evitar sobreventa.
- **Resiliencia y Validación**: Comunicación síncrona entre servicios con **OpenFeign** y manejo centralizado de errores con **ErrorDecoder**.
- **Seguridad de Tráfico**: Protección contra abuso mediante **Rate Limiting** basado en Redis en el Gateway.
- **Cloud Native**: Despliegue completo con Docker Compose y Service Discovery (Eureka).
- **Entrada Única**: API Gateway centralizado para enrutamiento y balanceo.

---

## 🏗️ Arquitectura del Sistema

El sistema se compone de 6 microservicios y 4 componentes de infraestructura:

- **Gateway (8080)**: Punto de entrada único.
- **Discovery (8761)**: Servidor de registro Eureka.
- **Catalog Service (8081)**: Gestión de eventos y artistas.
- **Booking Service (8082)**: Gestión de reservas y stock crítico.
- **Payment Service (8083)**: Procesamiento de pagos asíncrono.
- **Notification Service (8085)**: Envío de confirmaciones.

> [!TIP]
> Puedes ver los diagramas detallados de los flujos en [DIAGRAMS.md](./docs/DIAGRAMS.md).

---

## 🛠️ Guía de Inicio Rápido

### Requisitos previos
- Java 21+
- Maven
- Docker y Docker Compose

### 1. Compilación
Genera los artefactos de todos los servicios:
```bash
mvn clean package -DskipTests
```

### 2. Despliegue
Levanta toda la infraestructura y servicios con Docker:
```bash
sudo docker compose up --build -d
```

### 3. Verificación
Comprueba que todos los servicios están registrados en Eureka:
[http://localhost:8761](http://localhost:8761)

---

## ⚡ Guía de Uso de la API (vía Gateway 8080)

### 1. Listar Eventos
`GET http://localhost:8080/catalog/api/events`

### 2. Inicializar Stock
`PUT http://localhost:8080/booking/api/bookings/stock?eventId=1&ticketTypeId=1&quantity=100`

### 3. Crear una Reserva
`POST http://localhost:8080/booking/api/bookings`
```json
{
  "eventId": 1,
  "ticketTypeId": 1,
  "userId": "tester",
  "quantity": 2
}
```

---

## 📚 Documentación Detallada
Hemos preparado guías profundas para cada aspecto del sistema:

- 🌐 [Visión General de la Arquitectura](./docs/GENERAL_OVERVIEW.md)
- ⚔️ [Implementación del Patrón Saga](./docs/SAGA_PATTERN.md)
- 🐳 [Guía de Infraestructura y Docker](./docs/INFRASTRUCTURE.md)
- 📊 [Diagramas de Secuencia y Componentes](./docs/DIAGRAMS.md)

---
