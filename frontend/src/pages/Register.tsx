import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerService } from '../services/auth';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        setError('');
        try {
            // Using fullName as username for now as per DTO
            const data = await registerService(fullName, email, password);
            login({ username: data.username, email: data.email, userId: data.userId }, data.token);
            navigate('/');
        } catch (err: any) {
            setError('Error al crear la cuenta. Por favor, inténtalo de nuevo.');
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark font-display">
            {/* Left Side: Branded Imagery */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-20"></div>
                <div className="absolute inset-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHeGWjDpZKzaa-uvOnl_yQvt0acq7I6q0IHn98u7xvB0uC9s_KGEShh4heLGjOP6u2EAJDsKzBLczeWLhkCgno1MPUm8yoC03YqdFbVQcrM3xWBfvygH7W5B0QPENIwTyN3Fh5hPhYdMkzt0JQtJgcuPI87XolH_gWgBFBjDl7zd4yEvcCjvAHRzbgDLIWSW-nio8816aFpy0azrSyBtPavMGlhZyrlS7VRg3ikZegKvHestkBDDKcu4cDvyqnqn6c_kElfLSXovfD')" }}>
                </div>
                <div className="relative z-30 flex flex-col justify-end p-16 w-full text-white">
                    <div className="flex items-center gap-2 mb-6 text-white">
                        <span className="material-symbols-outlined text-primary text-4xl">confirmation_number</span>
                        <span className="text-2xl font-bold tracking-tight text-white">Ticket System</span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-white leading-tight mb-4">La mejor música, <br />a un clic de distancia.</h1>
                    <p className="text-slate-300 text-lg max-w-md">Únete a miles de fans y obtén acceso exclusivo a preventas, eventos VIP y los mejores asientos.</p>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-background-light dark:bg-background-dark">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
                        <span className="material-symbols-outlined text-primary text-3xl">confirmation_number</span>
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Ticket System</span>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Crear Cuenta</h2>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">Ingresa tus datos para comenzar tu experiencia.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm font-medium mb-6">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Nombre de Usuario</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xl font-light">person</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                    placeholder="Ej. juan_perez"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Correo Electrónico</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xl font-light">mail</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                    placeholder="tu@correo.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Contraseña</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xl font-light">lock</span>
                                <input
                                    className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-xl font-light">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Confirmar Contraseña</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-xl font-light">shield</span>
                                <input
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all mt-4 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Crear Cuenta
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-10 text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            ¿Ya tienes cuenta?
                            <Link className="text-primary dark:text-blue-400 font-bold hover:underline ml-1" to="/login">Inicia sesión</Link>
                        </p>
                    </div>

                    {/* Footer Copyright */}
                    <div className="mt-12 text-center text-xs text-slate-400 dark:text-slate-600">
                        © 2024 Ticket System. Todos los derechos reservados.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
