import React from 'react';
import AccountLayout from '../components/AccountLayout';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { fetchBookingsByUserId } from '../services/bookings';
import { fetchEventById } from '../services/events';
import { EventDate } from '../models/event';

const TicketItem: React.FC<{ booking: any }> = ({ booking }) => {
    const { data: event, isLoading } = useQuery({
        queryKey: ['event', booking.eventId],
        queryFn: () => fetchEventById(booking.eventId),
    });

    if (isLoading) return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
    );

    if (!event) return null;

    const eventDate = new EventDate(event.date);

    return (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-classic hover:shadow-classic-hover transition-all duration-300 flex flex-col md:flex-row">
            <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0 bg-slate-100">
                <img
                    src={event.imageUrl}
                    alt={event.artist}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-navy-dark/10"></div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-navy-dark text-[10px] font-bold px-3 py-1 rounded shadow-sm">
                    {booking.quantity} ENTRADAS
                </div>
                <div className="absolute top-3 right-3">
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700 border-green-200' :
                        booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                            'bg-red-100 text-red-700 border-red-200'
                        }`}>
                        {booking.status}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                            <span className="material-symbols-outlined text-lg">confirmation_number</span>
                            <span>RESERVA #{booking.id.toString().slice(-6).toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl font-bold text-navy-dark">{event.artist}</h2>
                        <div className="flex flex-wrap gap-y-2 gap-x-6 mt-3 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                                <span className="font-medium">{eventDate.formatted}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
                                <span>{eventDate.hour}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">location_on</span>
                                <span>{event.venue}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right hidden md:block">
                        <div className="bg-slate-50 p-2 rounded border border-slate-100 inline-block">
                            <span className="material-symbols-outlined text-4xl text-navy-dark">qr_code_2</span>
                        </div>
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                        ID Reservado: {booking.id}
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm font-semibold hover:bg-slate-50 hover:text-navy-dark transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">info</span>
                            Ver Detalles
                        </button>
                        <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">download</span>
                            Descargar PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MyTickets: React.FC = () => {
    const { user } = useAuth();
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['user-bookings', user?.userId],
        queryFn: () => fetchBookingsByUserId(user!.userId),
        enabled: !!user?.userId,
    });

    return (
        <AccountLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy-dark">Mis Entradas</h1>
                    <p className="text-slate-500 mt-1">Gestiona tus próximos eventos y entradas.</p>
                </div>
            </div>

            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 font-medium">Buscando tus entradas...</p>
                    </div>
                ) : bookings && bookings.length > 0 ? (
                    bookings
                        .sort((a, b) => Number(b.id) - Number(a.id))
                        .map((booking) => (
                            <TicketItem key={booking.id} booking={booking} />
                        ))
                ) : (
                    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <span className="material-symbols-outlined text-3xl text-slate-300">confirmation_number</span>
                        </div>
                        <h3 className="text-lg font-bold text-navy-dark">No tienes entradas aún</h3>
                        <p className="text-slate-500 mt-2">Cuando compres entradas para un evento, aparecerán aquí.</p>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
};

export default MyTickets;
