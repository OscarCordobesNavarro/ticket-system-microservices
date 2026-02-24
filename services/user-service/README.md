# 👤 User Service

Microservicio responsable de la **autenticación** y **gestión de usuarios**. Es el único servicio que emite tokens JWT en todo el sistema.

## 📄 Responsabilidades

1. **Registro** (`POST /api/auth/register`) — crea un usuario con contraseña hasheada (BCrypt) y devuelve un JWT.
2. **Login** (`POST /api/auth/login`) — autentica credenciales y emite un JWT con claims de identidad.
3. **Consulta de usuario** (`GET /api/users/{id}`) — devuelve datos públicos del usuario (requiere autenticación).
4. **Validación de existencia** (`GET /api/users/validate/{id}`) — endpoint interno para que otros servicios (booking) verifiquen que un userId existe.

## 🏗️ Arquitectura Interna

```
AuthController         UserController
      │                      │
AuthService            UserService (interface)
      │                      │
AuthServiceImpl        UserServiceImpl (@Service)
      │                      │
UserRepository ──────────────┘
      │
PostgreSQL (users_db)
```

## 🗄️ Modelo `User`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | `Long` | PK autoincremental |
| `username` | `String` | Único, usado como `sub` en JWT |
| `email` | `String` | Único |
| `password` | `String` | BCrypt hash |
| `role` | `Enum` | `USER`, `ADMIN` |

## 🔐 Seguridad

### Tokens JWT emitidos
Los tokens incluyen los siguientes claims:
```json
{
  "sub": "username",
  "userId": 42,
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Spring Security (Spring Boot 3 / Security 6)
- **Rutas públicas**: `/api/auth/**`, `/api/users/validate/**`, `/v3/api-docs/**`
- **Resto de rutas**: requieren token válido en header `Authorization: Bearer <token>`
- **`JwtAuthenticationFilter`**: valida el token y puebla el `SecurityContext`. Si el token es inválido en una ruta pública, lo ignora (no lanza excepción).
- **`AuthenticationEntryPoint`** personalizado: devuelve `401` con cuerpo JSON en lugar del `403` por defecto de Spring Security 6:
  ```json
  { "status": 401, "error": "No autorizado", "message": "Credenciales inválidas o token expirado" }
  ```

### ⚠️ Spring Security 6 — Cambio de comportamiento
En Spring Security 6, el `AuthenticationEntryPoint` por defecto es `Http403ForbiddenEntryPoint`. Esto causa que credenciales incorrectas devuelvan `403` en lugar de `401`. Se ha configurado explícitamente para corregirlo.

## 📡 Endpoints

### Autenticación (públicos)
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{username, email, password}` | `{token, userId, username, email}` |
| `POST` | `/api/auth/login` | `{username, password}` | `{token, userId, username, email}` |

### Usuarios (requieren JWT)
| Método | Ruta | Respuesta |
|---|---|---|
| `GET` | `/api/users/{id}` | `{id, username, email, role}` |
| `GET` | `/api/users/validate/{id}` | `true / false` |

## ⚙️ Variables de Entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` | Host PostgreSQL (default: `localhost`) |
| `DB_PORT` | Puerto PostgreSQL (default: `5432`) |
| `DB_USERNAME` | Usuario BD |
| `DB_PASSWORD` | Contraseña BD |
| `JWT_SECRET` | Clave secreta para firmar JWT (mín. 256 bits) |
| `EUREKA_HOST` | Host del servidor Eureka |
