import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchEventById } from '../services/events';
import { createBooking } from '../services/bookings';
import { EventDate } from '../models/event';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeedbackModal from '../components/FeedbackModal';

const EventBooking: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['event', id],
        queryFn: () => fetchEventById(Number(id)),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            setShowSuccessModal(true);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Hubo un problema al procesar tu reserva.');
            setShowErrorModal(true);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-surface font-sans">
                <Navbar />
                <main className="flex-grow flex items-center justify-center text-white">
                    Cargando detalles del evento...
                </main>
                <Footer />
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="min-h-screen flex flex-col bg-surface font-sans">
                <Navbar />
                <main className="flex-grow flex items-center justify-center text-white">
                    No se pudo cargar el evento.
                </main>
                <Footer />
            </div>
        );
    }

    const eventDate = new EventDate(event.date);
    const serviceFee = 12.50;
    const itemTotal = event.price * quantity;
    const total = itemTotal + serviceFee;

    const handleReserve = () => {
        mutation.mutate({
            eventId: Number(id),
            userId: 'user-123', // Hardcoded for now
            quantity: quantity
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans relative overflow-x-hidden">
            {/* Background Decorator */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none filter blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${event.imageUrl})` }}>
            </div>
            <div className="absolute inset-0 z-0 bg-slate-200/50 pointer-events-none"></div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 md:flex-row">
                        {/* Left Side: Ticket Selection */}
                        <div className="flex flex-col gap-6 p-6 md:w-3/5 md:p-10 overflow-y-auto max-h-[90vh] md:max-h-none">
                            <div className="space-y-4">
                                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-100 border border-gray-200 shadow-inner">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.artist}
                                        className="h-full w-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                                        <h2 className="text-3xl font-black tracking-tight text-white">{event.artist}</h2>
                                        <div className="mt-1 flex items-center text-sky-300 font-bold">
                                            <span className="material-symbols-outlined mr-1 text-[20px]">location_on</span>
                                            {event.venue}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-slate-800 shadow-lg border border-gray-200 flex items-center">
                                        <span className="material-symbols-outlined align-middle text-[16px] mr-1.5 text-primary">calendar_today</span>
                                        {eventDate.formatted} • {eventDate.hour}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-2 uppercase tracking-wider">Entradas Disponibles</h3>
                                <div className="flex flex-col gap-3">
                                    <label className="group relative flex cursor-pointer items-center justify-between rounded-xl border-2 border-primary bg-blue-50/50 p-5 transition-all shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="h-5 w-5 rounded-full border-4 border-primary bg-white"></div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-lg">Entrada General</p>
                                                <p className="text-xs text-primary font-bold mt-1 flex items-center gap-1 uppercase tracking-tighter">
                                                    <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                                                    Alta Demanda
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-900">{event.price}€</p>
                                            <p className="text-xs text-emerald-600 font-bold uppercase">En Stock</p>
                                        </div>
                                    </label>

                                    <div className="group relative flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-5 opacity-60 grayscale cursor-not-allowed">
                                        <div className="flex items-center gap-4">
                                            <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-gray-100"></div>
                                            <div>
                                                <p className="font-bold text-slate-500 text-lg">VIP Front Pit</p>
                                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">Acceso Exclusivo</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-slate-400">240€</p>
                                            <p className="text-xs text-red-500 font-bold uppercase tracking-tighter">Próximamente</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-5 border border-gray-200 shadow-sm mt-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-slate-500 shadow-sm">
                                        <span className="material-symbols-outlined">confirmation_number</span>
                                    </div>
                                    <span className="font-bold text-slate-700">Cantidad</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white rounded-xl p-1.5 border border-gray-200 shadow-inner">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-slate-600 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                        disabled={quantity <= 1 || mutation.isPending}
                                    >
                                        <span className="material-symbols-outlined font-bold text-[20px]">remove</span>
                                    </button>
                                    <span className="w-8 text-center font-black text-xl text-slate-800">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary-dark transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                                        disabled={mutation.isPending}
                                    >
                                        <span className="material-symbols-outlined font-bold text-[20px]">add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="flex flex-col justify-between bg-slate-50 p-6 md:w-2/5 md:p-10 md:border-l md:border-gray-200">
                            <div className="space-y-8">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                    <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Tu Pedido</h3>
                                    <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-black text-blue-700 border border-blue-200 uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-[14px]">timer</span>
                                        <span>05:00 Reservado</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-base text-slate-600">
                                        <span className="font-medium">Entrada General (x{quantity})</span>
                                        <span className="font-black text-slate-900">{itemTotal.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-[14px] text-slate-500">
                                        <span>Gastos de Gestión</span>
                                        <span className="font-bold text-slate-800">{serviceFee.toFixed(2)}€</span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-dashed border-gray-300 pt-6">
                                    <div className="flex items-end justify-between">
                                        <span className="text-lg font-bold text-slate-700 uppercase tracking-tight">Total</span>
                                        <div className="text-right">
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">{total.toFixed(2)}€</span>
                                            <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">Impuestos Incluidos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 space-y-4">
                                <button
                                    onClick={handleReserve}
                                    disabled={mutation.isPending}
                                    className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-5 text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary-dark hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {mutation.isPending ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span>RESERVAR ENTRADAS</span>
                                            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex items-center justify-center gap-2 rounded-xl bg-white py-3 border border-gray-200 shadow-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        Inventario <span className="text-emerald-600 font-black">REDIS</span> Activo
                                    </p>
                                </div>
                                <p className="text-center text-[11px] text-slate-400 font-medium leading-relaxed">
                                    Al continuar, aceptas nuestros términos de servicio. Las entradas se bloquean temporalmente durante el proceso.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>

            {/* Success Modal */}
            <FeedbackModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                }}
                type="success"
                title="¡Reserva Confirmada!"
                message={`Hemos reservado ${quantity} entradas para ${event.artist}. Te hemos enviado un correo con los detalles.`}
                actionLabel="Volver al inicio"
                onAction={() => navigate('/')}
            />

            {/* Error Modal */}
            <FeedbackModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                type="error"
                title="Error en la Reserva"
                message={errorMessage}
                actionLabel="Intentar de nuevo"
            />
        </div>
    );
};

export default EventBooking;
