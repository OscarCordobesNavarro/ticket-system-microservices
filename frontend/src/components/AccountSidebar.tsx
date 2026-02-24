import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AccountSidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        {
            label: 'Mis Entradas',
            path: '/my-tickets',
            icon: 'confirmation_number'
        },
        {
            label: 'Historial de Pedidos',
            path: '/order-history',
            icon: 'history'
        },
        {
            label: 'Configuración',
            path: '/settings',
            icon: 'manage_accounts'
        }
    ];

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg border-l-4 transition-all ${isActive
                                ? 'text-primary bg-blue-50 border-primary'
                                : 'text-slate-600 hover:text-navy-dark hover:bg-white border-transparent'
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-navy-dark'
                                }`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default AccountSidebar;
