import React from 'react';

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full glass-panel">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20 gap-4">
                    <div className="flex items-center gap-3 min-w-fit">
                        <div className="size-10 bg-navy-dark rounded text-white flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-navy-dark">Ticket System</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>
                        <button className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                            <div className="size-8 rounded-full bg-slate-200 p-[1px] border border-slate-300 overflow-hidden">
                                <span className="material-symbols-outlined text-slate-500 flex items-center justify-center h-full">account_circle</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-700">Invitado</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
