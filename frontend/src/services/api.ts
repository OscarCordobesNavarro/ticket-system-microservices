import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor to handle specific errors (401, 429) across all services
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login';
        }
    }

    // Handle 403 Forbidden (Identity Mismatch)
    if (error.response && error.response.status === 403) {
        alert('Acceso Denegado: Tu identidad no coincide con el recurso solicitado.');
    }

    // Handle 429 Too Many Requests (Rate Limiter)
    if (error.response && error.response.status === 429 && !originalRequest._retry) {
        originalRequest._retry = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
    }

    return Promise.reject(error);
});

export default api;
