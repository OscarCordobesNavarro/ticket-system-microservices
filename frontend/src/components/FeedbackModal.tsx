import React from 'react';

export type ModalType = 'success' | 'error' | 'info';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ModalType;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    isOpen,
    onClose,
    type,
    title,
    message,
    actionLabel,
    onAction,
}) => {
    if (!isOpen) return null;

    const config = {
        success: {
            icon: 'check_circle',
            iconColor: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            buttonColor: 'bg-primary hover:bg-primary/90',
            shadow: 'hover:shadow-primary/10',
            buttonShadow: 'shadow-primary/20',
        },
        error: {
            icon: 'error',
            iconColor: 'text-rose-500',
            bgColor: 'bg-rose-500/10',
            buttonColor: 'bg-rose-600 hover:bg-rose-700',
            shadow: 'hover:shadow-red-500/10',
            buttonShadow: 'shadow-rose-600/20',
        },
        info: {
            icon: 'info',
            iconColor: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
            buttonColor: 'bg-slate-700 hover:bg-slate-600',
            shadow: 'hover:shadow-blue-500/10',
            buttonShadow: 'shadow-transparent',
        },
    }[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={`relative flex flex-col w-full max-w-md bg-[#1a202c] border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ${config.shadow} animate-in zoom-in-95 duration-300`}>
                <div className="p-8 flex flex-col items-center text-center space-y-6">
                    <div className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-5xl ${config.iconColor}`}>
                            {config.icon}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-extrabold text-white tracking-tight">
                            {title}
                        </h3>
                        <p className="text-slate-400 text-base leading-relaxed">
                            {message}
                        </p>
                    </div>

                    <div className="w-full space-y-3 pt-2">
                        {actionLabel && (
                            <button
                                onClick={() => {
                                    onAction?.();
                                    onClose();
                                }}
                                className={`w-full flex items-center justify-center rounded-lg h-12 px-6 ${config.buttonColor} transition-all duration-200 text-white text-sm font-bold tracking-wide shadow-lg ${config.buttonShadow} hover:scale-[1.02] active:scale-95`}
                            >
                                {actionLabel}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-full flex items-center justify-center rounded-lg h-12 px-6 bg-transparent hover:bg-white/5 transition-all duration-200 text-slate-400 hover:text-white text-sm font-medium"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
