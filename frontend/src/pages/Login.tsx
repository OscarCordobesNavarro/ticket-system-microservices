import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginService } from '../services/auth';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const data = await loginService(username, password);
            login({ username: data.username, email: data.email, userId: data.userId }, data.token);
            navigate('/');
        } catch (err: any) {
            setError('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
            {/* Left Side: Branding and Visual */}
            <div className="relative hidden w-1/2 lg:block">
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent z-10"></div>
                <div className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZkAeYrmzeSlRkZNqNQsbFdzIbxP5Vdp8PL0d-VRjG-MliJH-IFj_KUtKH0IRxkMlkiK3bF6jGEb4oOF_llv5m-xDrokPFahsPgb_M8b9wEuxIYoRCfKvvVhGqIzJPyGgWmPP3UVSNi-pNyD6kKi_mStm1zFOE_RMqFjqqW7Z-SNMeoLHj_9RGNtazWuD7cyUsbsYIbClXot97hbfchMPGfw5S5kBGzryvoLtIk2W86PnHMQDODrW3FX3YOWr-ywQg6sQLTTc1HzCJ')" }}>
                </div>
                <div className="relative z-20 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg text-white">
                            <span className="material-symbols-outlined text-3xl">confirmation_number</span>
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight">Ticket System</h2>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-5xl font-extrabold leading-tight mb-6">Tus eventos favoritos, a un clic de distancia.</h1>
                        <p className="text-lg text-slate-100 font-medium">Únete a la plataforma líder en gestión de entradas para los conciertos y eventos más esperados del año.</p>
                    </div>
                    <div className="flex gap-6 text-sm font-medium">
                        <a className="hover:underline" href="#">Privacidad</a>
                        <a className="hover:underline" href="#">Términos y Condiciones</a>
                        <a className="hover:underline" href="#">Soporte</a>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex flex-col items-center justify-center w-full bg-background-light dark:bg-background-dark lg:w-1/2 p-8 sm:p-12">
                <div className="w-full max-w-[440px] space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">Bienvenido de nuevo</h2>
                        <p className="mt-2 text-slate-600 dark:text-slate-300 font-medium">Ingresa tus credenciales para acceder a tu cuenta.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200" htmlFor="username">Usuario</label>
                            <input
                                className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none"
                                id="username"
                                name="username"
                                placeholder="Tu nombre de usuario"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-slate-800 dark:text-slate-200" htmlFor="password">Contraseña</label>
                            </div>
                            <div className="relative group">
                                <input
                                    className="w-full h-12 pl-4 pr-12 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <input className="h-4 w-4 rounded border-slate-400 dark:border-slate-600 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-slate-900" id="remember" name="remember" type="checkbox" />
                            <label className="ml-3 text-sm text-slate-700 dark:text-slate-300 font-medium cursor-pointer" htmlFor="remember">Mantener sesión iniciada</label>
                        </div>
                        <button
                            className={`w-full h-12 flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div aria-hidden="true" className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm font-medium">
                            <span className="bg-background-light dark:bg-background-dark px-4 text-slate-600 dark:text-slate-400 uppercase tracking-wider">O</span>
                        </div>
                    </div>

                    <p className="text-center text-sm font-medium text-slate-700 dark:text-slate-300">
                        ¿No tienes una cuenta?
                        <Link className="font-bold text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 transition-colors ml-1" to="/register">Regístrate gratis</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
