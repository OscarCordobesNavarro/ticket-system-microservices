# 🎫 Catalog Service

Este servicio actúa como la fuente de verdad para los eventos disponibles en el sistema.

## 📄 Responsabilidades
1. Gestionar la información de los eventos (Artistas, Recintos, Fechas).
2. Servir la lista de eventos para que el Frontend la muestre.

## 🗄️ Base de Datos: `events_db` (Postgres:5432)
**Entidad `Event`:**
- `name`: Nombre del tour o concierto.
- `artist`: Nombre del artista o grupo.
- `venue`: Estadio, teatro o sala de conciertos.
- `date`: Fecha y hora del evento.
- `description`: Detalles adicionales.

## 📡 Endpoints
- `GET /api/events`: Devuelve todos los conciertos registrados.
- `POST /api/events`: Registra un nuevo evento.
- `GET /api/events/{id}`: Detalle de un evento específico.

## ⚙️ Configuración Destacada
El servicio utiliza `spring.jpa.hibernate.ddl-auto=update` para agilizar el desarrollo, creando automáticamente el esquema en la base de datos de PostgreSQL al arrancar.
