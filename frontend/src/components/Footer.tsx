import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-200 mt-8 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-slate-500 text-sm font-medium">
                    © 2024 Ticket System. Todos los derechos reservados.
                </div>
                <div className="flex gap-6 text-sm text-slate-600 font-medium">
                    <a className="hover:text-primary transition-colors" href="#">Política de Privacidad</a>
                    <a className="hover:text-primary transition-colors" href="#">Términos de Servicio</a>
                    <a className="hover:text-primary transition-colors" href="#">Centro de Ayuda</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
