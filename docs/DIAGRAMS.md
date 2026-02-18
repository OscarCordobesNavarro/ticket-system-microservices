# 📊 Diagramas de la Arquitectura

Para entender visualmente cómo interactúan los componentes, hemos preparado estos diagramas utilizando **Mermaid**.

## 1. Mapa de Componentes (Infraestructura)
Este diagrama muestra cómo el **Gateway** protege los servicios internos y cómo todos dependen de **Eureka** para encontrarse.

```mermaid
graph TD
    User((Usuario Final)) -->|Port 8080| Gateway[API Gateway]
    
    subgraph "Red Interna Docker (ticket-network)"
        Gateway --> Catalog[Catalog Service]
        Gateway --> Booking[Booking Service]
        
        Catalog & Booking & Payment & Notification -->|Registro| Eureka[Discovery Server]
        
        Booking -->|Persistencia| DBB[(Postgres: Bookings)]
        Booking -->|Sección Crítica| Redis[(Redis: Stock)]
        
        Catalog -->|Persistencia| DBC[(Postgres: Events)]
        
        Booking -.->|Eventos| RMQ[RabbitMQ Bus]
        RMQ -.-> Payment[Payment Service]
        RMQ -.-> Notification[Notification Service]
    end
```

---

## 2. Diagrama de Secuencia: Flujo Exitoso
Representa el camino "feliz" desde que el usuario solicita la entrada hasta que recibe la notificación.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant G as Gateway
    participant B as Booking Service
    participant R as Redis
    participant P as Payment Service
    participant N as Notification Service

    U->>G: POST /booking/api/bookings
    G->>B: Reenvía petición
    B->>R: DECR stock:eventId (Atómico)
    R-->>B: OK (Stock disponible)
    B->>B: Guarda Booking (Status: PENDING)
    B->>U: HTTP 200 (Reserva creada)
    
    Note over B,P: Inicio Proceso Asíncrono
    B->>P: Evento: booking.created
    P->>P: Simula Pago (2s)
    P->>N: Evento: payment.success
    N->>N: Log: ¡Notificación enviada!
```

---

## 3. Diagrama de Secuencia: Flujo de Compensación (Saga)
Muestra qué ocurre cuando el pago falla y el sistema debe auto-corregirse.

```mermaid
sequenceDiagram
    participant U as Usuario
    participant B as Booking Service
    participant R as Redis
    participant P as Payment Service

    U->>B: Reserva de entradas
    B->>R: Decrementa Stock (-2)
    B->>P: Evento: booking.created
    
    Note right of P: El pago es rechazado
    P->>B: Evento: booking.failed (Compensación)
    
    rect rgb(255, 230, 230)
        Note over B,R: Transacción de Compensación
        B->>B: Update Booking (Status: CANCELLED)
        B->>R: INCR stock:eventId (+2)
    end
```

---

## 4. Estructura de Datos (ER Simple)
Cada servicio gestiona su propio esquema, pero están vinculados por IDs.

```mermaid
erDiagram
    EVENT {
        long id PK
        string name
        string artist
        datetime date
    }
    
    BOOKING {
        long id PK
        long eventId FK
        string userId
        int quantity
        string status
    }

    EVENT ||--o{ BOOKING : "referenciado por id"
```
