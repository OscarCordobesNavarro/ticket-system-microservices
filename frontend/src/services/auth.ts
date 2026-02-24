import api from './api';

export interface AuthResponse {
    token: string;
    username: string;
    email: string;
    userId: number;
}

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/user/api/auth/login', { username, password });
    return data;
};

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/user/api/auth/register', { username, email, password });
    return data;
};

export default api;
