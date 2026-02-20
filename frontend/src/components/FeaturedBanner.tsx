import React from 'react';
import { Link } from 'react-router-dom';
import { EventStatus } from '../models/event';
import type { Event } from '../models/event';

interface FeaturedBannerProps {
    event?: Event;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({ event }) => {
    if (!event) return null;

    return (
        <section className="relative rounded-lg overflow-hidden min-h-[400px] lg:min-h-[480px] shadow-lg group w-full bg-navy-dark">
            <div
                className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{
                    backgroundImage: `url(${event.imageUrl})`,
                }}
            ></div>
            <div className="relative h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 max-w-4xl z-10">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded bg-white text-navy-dark text-xs font-bold uppercase tracking-wider shadow-sm">
                        Evento Destacado
                    </span>
                    {event.status === 'LOW_STOCK' && (
                        <span className="flex items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded bg-orange-600 border border-orange-500">
                            <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                            ¡Agotándose!
                        </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                    {event.artist}: <br className="hidden md:block" />
                    <span className="text-sky-300">{event.name}</span>
                </h1>
                <p className="text-slate-200 text-lg md:text-xl max-w-2xl mb-8 font-normal line-clamp-2">
                    {event.description}
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link
                        to={`/book/${event.id}`}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded font-bold text-base transition-colors shadow-md flex items-center gap-2"
                    >
                        <span>Comprar Entradas</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                    <button className="bg-transparent hover:bg-white/10 text-white px-6 py-3 rounded font-semibold text-base transition-colors border-2 border-white flex items-center gap-2">
                        <span className="material-symbols-outlined">info</span>
                        <span>Más detalles</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedBanner;

