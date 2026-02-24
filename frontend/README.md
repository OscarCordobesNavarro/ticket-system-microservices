# 🖥️ Frontend — Ticket System

Aplicación cliente construida con **React 19 + TypeScript + Vite**. Se comunica exclusivamente con el **API Gateway** en `http://localhost:8080`.

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** | UI framework |
| **TypeScript** | Tipado estático |
| **Vite** | Bundler y dev server (HMR) |
| **TailwindCSS** | Estilos utility-first |
| **TanStack Query** | Server state management (fetch, cache, polling) |
| **React Router v6** | Enrutamiento SPA |
| **Axios** | Cliente HTTP con interceptores |

## 🗂️ Estructura

```
src/
├── components/
│   ├── ProtectedRoute.tsx    # Guardia de rutas (verifica token + isLoading)
│   └── AccountLayout.tsx     # Layout para páginas de cuenta
├── context/
│   └── AuthContext.tsx       # Estado global de autenticación + triggerLogout
├── models/
│   └── booking.ts            # Tipos TypeScript (userId: number, id: number)
├── pages/
│   ├── Login.tsx             # Formulario de login
│   ├── Register.tsx          # Formulario de registro
│   ├── Home.tsx              # Catálogo de eventos
│   ├── EventBooking.tsx      # Reserva + polling de estado
│   └── MyTickets.tsx         # Mis reservas
└── services/
    ├── api.ts                # Axios instance + interceptores globales
    ├── auth.ts               # login() y register()
    ├── bookings.ts           # CRUD de reservas
    └── events.ts             # Consulta de eventos
```

## 🔒 Gestión de Autenticación

### `AuthContext.tsx`
- Valida la **expiración del JWT** al montar (decodifica `exp` sin librería externa).
- Expone `isLoading: true` mientras se verifica el token del localStorage → evita flash de redirección.
- Expone `triggerLogout()` para que `api.ts` pueda invocar el logout fuera del árbol React.

### `api.ts` — Interceptores Axios

**Request interceptor:**
```
Token en localStorage + ruta NO es /api/auth/ → añade Authorization: Bearer <token>
Ruta /api/auth/ (login/register)              → NO añade token
```
> Razón: enviar un token expirado en la petición de login haría que el filtro JWT del backend la rechazara con 403.

**Response interceptor:**
| Status | Acción |
|---|---|
| `401` | `triggerLogout()` + redirect a `/login` (si no es ruta de auth) |
| `403` | Warning en consola + alert de acceso denegado (solo en rutas no-auth) |
| `429` | Retry automático tras 1 segundo |

### `ProtectedRoute.tsx`
- Muestra spinner si `isLoading === true` (AuthContext verificando token)
- Redirige a `/login` si `isAuthenticated === false`
- Renderiza el outlet si autenticado

## 🔄 Flujo de Reserva (EventBooking + Polling)

```
1. Usuario selecciona entradas → POST /booking/api/bookings
2. Booking creado con status PENDING
3. Inicia polling cada 2s → GET /booking/api/bookings/{id}
4. Cuando status cambia a CONFIRMED/CANCELLED/EXPIRED → para el polling
5. Muestra resultado al usuario
```

## 🚀 Desarrollo local

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## 📦 Build de producción

```bash
npm run build
# Output en /dist
```

## ⚙️ Configuración

La URL base del API está en `src/services/api.ts`:
```ts
const api = axios.create({
    baseURL: 'http://localhost:8080', // API Gateway
});
```
