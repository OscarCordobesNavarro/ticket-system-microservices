import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
    username: string;
    email: string;
    userId: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Utilidad: decodifica el payload JWT sin librería ───────────────────────
function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        if (!payload.exp) return false;
        // exp está en segundos, Date.now() en ms
        return payload.exp * 1000 < Date.now();
    } catch {
        return true; // si no se puede parsear, tratar como expirado
    }
}

// ─── Canal de comunicación entre api.ts y AuthContext ───────────────────────
// api.ts no puede usar hooks, así que AuthContext registra aquí un callback
// que api.ts puede llamar cuando detecta un 401.
let logoutCallback: (() => void) | null = null;

export function registerLogoutCallback(cb: () => void) {
    logoutCallback = cb;
}

export function triggerLogout() {
    logoutCallback?.();
}

// ────────────────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // true hasta validar el token al montar

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    // Al montar: recuperar sesión del localStorage y validar expiración
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            if (isTokenExpired(savedToken)) {
                // Token expirado: limpiar sin redirigir (la ruta protegida
                // se encargará de redirigir al login si es necesario)
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } else {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            }
        }

        setIsLoading(false);
    }, []);

    // Registrar el callback de logout para que api.ts pueda llamarlo
    useEffect(() => {
        registerLogoutCallback(logout);
    }, [logout]);

    const login = useCallback((userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
