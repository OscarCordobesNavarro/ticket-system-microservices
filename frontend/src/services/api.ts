import axios from 'axios';
import { triggerLogout } from '../context/AuthContext';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
// Añade el token JWT a todas las peticiones EXCEPTO las de auth (login/register).
// Motivo: si hay un token expirado en localStorage, no queremos enviarlo al login
// porque el filtro JWT del backend lo rechazaría con 403 aunque la ruta sea pública.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const isAuthRoute = config.url?.includes('/api/auth/');
    if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ─── Response Interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url ?? '';
        const isAuthRoute = requestUrl.includes('/api/auth/');

        // 401 Unauthorized: token expirado o inválido → cerrar sesión y redirigir
        if (status === 401) {
            triggerLogout(); // actualiza el estado React correctamente
            if (!isAuthRoute) {
                window.location.href = '/login';
            }
        }

        // 403 Forbidden: solo mostrar alerta en rutas NO-auth y NO-login
        // (evitar el alert cuando el propio login retorna 403 por algún motivo de config)
        if (status === 403 && !isAuthRoute) {
            console.warn(`Acceso denegado (403) en: ${requestUrl}`);
            // Solo mostrar alerta si no es una ruta de auth: el usuario intentó
            // acceder a un recurso que no le pertenece.
            alert('Acceso Denegado: No tienes permiso para realizar esta acción.');
        }

        // 429 Too Many Requests: reintento automático tras 1 segundo
        if (status === 429 && !error.config._retry) {
            error.config._retry = true;
            await new Promise(resolve => setTimeout(resolve, 1000));
            return api(error.config);
        }

        return Promise.reject(error);
    }
);

export default api;
