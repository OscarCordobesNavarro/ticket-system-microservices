# 🐳 Infraestructura y Despliegue con Docker

Toda la plataforma está preparada para ser levantada con una sola línea de comandos, garantizando que el entorno de desarrollo sea idéntico al de producción.

## 🗄️ Elementos del Ecosistema

### Bases de Datos (PostgreSQL)
- **Instancia 1 (db-events)**: Puerto 5432. Base de datos `events_db`.
- **Instancia 2 (db-bookings)**: Puerto 5433 (interno 5432). Base de datos `bookings_db`.
- *Nota: Usamos instancias separadas para garantizar que los microservicios no comparten base de datos (Database per Service).*

### Caché (Redis)
- Puerto 6379.
- Usado exclusivamente por el `booking-service` para la lógica de stock.
- Persistencia habilitada para no perder el stock si el contenedor se reinicia.

### Mensajería (RabbitMQ)
- Puerto 5672 (Mensajes AMQP).
- Puerto 15672 (Panel de Gestión Web).
- Configurado con un `TopicExchange` para permitir enrutamiento complejo en el futuro.

## 🛠️ Comandos de Gestión

### 1. Compilación
Antes de dockerizar, debemos generar los artefactos:
```bash
mvn clean package -DskipTests
```

### 2. Arranque Completo
```bash
sudo docker compose up --build -d
```

### 3. Visualización de Logs (Crucial para ver el flujo)
```bash
sudo docker compose logs -f
```

### 4. Parada y Limpieza
```bash
sudo docker compose down -v
```
*(El flag `-v` borra también los datos de los volúmenes, ideal para empezar de cero).*
