import { Link } from 'react-router-dom';
import { EventStatus } from '../models/event';

interface EventCardProps {
    id: number;
    title: string;
    artist: string;
    venue: string;
    date: string;
    time: string;
    price: number;
    imageUrl: string;
    status: EventStatus;
}

const EventCard: React.FC<EventCardProps> = ({
    id,
    title,
    artist,
    venue,
    date,
    time,
    price,
    imageUrl,
    status,
}) => {
    const statusColors: Record<EventStatus, string> = {
        AVAILABLE: 'bg-green-100 text-green-800 border-green-200',
        LOW_STOCK: 'bg-amber-100 text-amber-800 border-amber-200',
        SOLD_OUT: 'bg-slate-100 text-slate-600 border-slate-200',
        NOT_AVAILABLE: 'bg-gray-100 text-gray-500 border-gray-200',
        CANCELLED: 'bg-red-100 text-red-600 border-red-200',
    };

    const statusLabels: Record<EventStatus, string> = {
        AVAILABLE: 'DISPONIBLE',
        LOW_STOCK: 'ÚLTIMAS ENTRADAS',
        SOLD_OUT: 'AGOTADO',
        NOT_AVAILABLE: 'NO DISPONIBLE',
        CANCELLED: 'CANCELADO',
    };

    const statusIcons: Record<EventStatus, React.ReactNode> = {
        AVAILABLE: (
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
            </span>
        ),
        LOW_STOCK: (
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </span>
        ),
        SOLD_OUT: <span className="material-symbols-outlined text-[14px]">block</span>,
        NOT_AVAILABLE: <span className="material-symbols-outlined text-[14px]">visibility_off</span>,
        CANCELLED: <span className="material-symbols-outlined text-[14px]">event_busy</span>,
    };

    return (
        <article className={`group relative bg-white rounded-lg overflow-hidden border border-slate-200 card-hover-effect flex flex-col h-full shadow-sm ${status === 'SOLD_OUT' ? 'opacity-90 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500' : ''}`}>
            <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold shadow-sm ${statusColors[status]}`}>
                        {statusIcons[status]}
                        {statusLabels[status]}
                    </div>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow relative border-t border-slate-100">
                <div className="absolute -top-10 right-4 bg-white px-3 py-2 rounded border border-slate-200 text-center shadow-md">
                    <span className="block text-xs uppercase text-slate-500 font-bold tracking-wide">{date.split(' ')[0]}</span>
                    <span className="block text-xl font-bold text-navy-dark leading-none">{date.split(' ')[1]}</span>
                </div>
                <h3 className="text-lg font-bold text-navy-dark mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {artist}
                </h3>
                <p className="text-sm font-medium text-slate-500 mb-4">{title}</p>
                <div className="flex items-start gap-2 text-slate-600 text-sm mb-2">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0 text-slate-400">location_on</span>
                    <span className="line-clamp-1">{venue}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm mb-6">
                    <span className="material-symbols-outlined text-base shrink-0 text-slate-400">schedule</span>
                    <span>{time}</span>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 mb-0.5">Desde</p>
                        <p className={`text-lg font-bold ${status === 'SOLD_OUT' ? 'text-slate-400 line-through' : 'text-navy-dark'}`}>
                            {price}€
                        </p>
                    </div>
                    <Link
                        to={`/book/${id}`}
                        className={`text-sm font-semibold px-4 py-2 rounded transition-colors shadow-sm ${status === 'SOLD_OUT'
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 pointer-events-none'
                            : 'bg-primary hover:bg-primary-dark text-white'
                            }`}
                    >
                        {status === 'SOLD_OUT' ? 'Lista de espera' : 'Comprar Entradas'}
                    </Link>
                </div>
            </div>
        </article >
    );
};

export default EventCard;
