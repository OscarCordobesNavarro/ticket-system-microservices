import React from 'react';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED' | 'TIMEOUT';

interface BookingStatusModalProps {
    isOpen: boolean;
    status: BookingStatus;
    onClose: () => void;
    onViewTickets?: () => void;
}

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
    isOpen,
    status,
    onClose,
    onViewTickets,
}) => {
    if (!isOpen) return null;

    const config = {
        PENDING: {
            icon: 'sync',
            iconColor: 'text-primary',
            bgColor: 'bg-primary/10',
            title: 'Procesando Reserva',
            message: 'Estamos procesando tu pago, no cierres esta ventana...',
            showButton: false,
            animateIcon: 'animate-spin',
        },
        CONFIRMED: {
            icon: 'check_circle',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            title: 'Operación Exitosa',
            message: 'Tu solicitud ha sido procesada correctamente. Los detalles de tu compra y los tickets digitales han sido enviados a tu correo electrónico registrado.',
            showButton: true,
            buttonText: 'Volver al inicio',
            buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
            onAction: onViewTickets,
        },
        CANCELLED: {
            icon: 'cancel',
            iconColor: 'text-rose-500',
            bgColor: 'bg-rose-500/10',
            title: 'Pago Rechazado',
            message: 'No hemos podido procesar tu pago. Por favor, verifica los detalles de tu tarjeta e inténtalo de nuevo.',
            showButton: true,
            buttonText: 'Entendido',
            buttonColor: 'bg-rose-600 hover:bg-rose-700',
            onAction: onClose,
        },
        EXPIRED: {
            icon: 'timer_off',
            iconColor: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
            title: 'Reserva Expirada',
            message: 'El tiempo límite de 10 minutos para completar tu reserva ha expirado. Las entradas han sido liberadas.',
            showButton: true,
            buttonText: 'Entendido',
            buttonColor: 'bg-amber-600 hover:bg-amber-700',
            onAction: onClose,
        },
        TIMEOUT: {
            icon: 'hourglass_empty',
            iconColor: 'text-slate-500',
            bgColor: 'bg-slate-500/10',
            title: 'Servicio Lento',
            message: 'Estamos experimentando retrasos. Por favor, revisa tu historial de pedidos en unos minutos para confirmar si la reserva se procesó.',
            showButton: true,
            buttonText: 'Revisar más tarde',
            buttonColor: 'bg-slate-700 hover:bg-slate-800',
            onAction: onClose,
        }
    }[status];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-300">
            <div className="w-full max-w-md bg-white dark:bg-[#1a2233] rounded-xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon Wrapper */}
                    <div className={`mb-6 flex items-center justify-center size-20 rounded-full ${config.bgColor} border-4 border-opacity-20`}>
                        <span className={`material-symbols-outlined text-4xl ${config.iconColor} font-bold ${config.animateIcon || ''}`}>
                            {config.icon}
                        </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                        {config.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-8">
                        {config.message}
                    </p>

                    {/* Action Button */}
                    {config.showButton && (
                        <button
                            onClick={config.onAction || onClose}
                            className={`w-full py-4 px-6 ${config.buttonColor} text-white font-bold rounded-lg transition-all active:scale-[0.98] shadow-lg`}
                        >
                            {config.buttonText}
                        </button>
                    )}

                    {!config.showButton && (
                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] w-1/3 rounded-full"></div>
                        </div>
                    )}
                </div>

                {/* Modal Footer Info */}
                <div className="bg-slate-50 dark:bg-black/20 px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-sm">info</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                        {status === 'PENDING' ? 'No cierres ni refresques esta página' : 'Puedes cerrar esta ventana para continuar'}
                    </span>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}} />
        </div>
    );
};

export default BookingStatusModal;
