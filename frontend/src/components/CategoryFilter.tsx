import React from 'react';

const CategoryFilter: React.FC = () => {
    return (
        <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sticky top-20 z-30 py-4 bg-surface/95 backdrop-blur-sm -mx-4 px-4 md:mx-0 md:px-0 border-b border-slate-200 md:border-none">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                <button className="whitespace-nowrap px-5 py-2 rounded-full bg-navy-dark text-white font-semibold text-sm shadow-sm transition-all">
                    Todos los Eventos
                </button>
                <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-navy-dark font-medium text-sm border border-slate-200 transition-all shadow-sm">
                    Conciertos
                </button>
                <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-navy-dark font-medium text-sm border border-slate-200 transition-all shadow-sm">
                    Deportes
                </button>
                <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-navy-dark font-medium text-sm border border-slate-200 transition-all shadow-sm">
                    Teatro
                </button>
                <button className="whitespace-nowrap px-5 py-2 rounded-full bg-white text-slate-600 hover:bg-slate-100 hover:text-navy-dark font-medium text-sm border border-slate-200 transition-all shadow-sm">
                    Comedia
                </button>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                <span className="material-symbols-outlined text-lg">tune</span>
                <span>Filtros</span>
                <div className="h-4 w-[1px] bg-slate-300"></div>
                <button className="flex items-center gap-1 hover:text-navy-dark transition-colors">
                    Fecha <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
                </button>
            </div>
        </section>
    );
};

export default CategoryFilter;
