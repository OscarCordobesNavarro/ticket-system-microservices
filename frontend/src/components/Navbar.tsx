import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 w-full glass-panel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <Link to="/" className="flex items-center gap-3 min-w-fit">
                        <div className="size-10 bg-navy-dark rounded text-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-navy-dark">Ticket System</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
                                <div className="flex items-center gap-2">
                                    <Link to="/my-tickets" className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                                        <div className="size-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
                                            <span className="material-symbols-outlined text-slate-500 text-[22px]">account_circle</span>
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{user?.username || 'Usuario'}</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                                        title="Cerrar sesión"
                                    >
                                        <span className="material-symbols-outlined">logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 transition-all shadow-md active:scale-95"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
