import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import FeaturedBanner from '../components/FeaturedBanner';
import EventCard from '../components/EventCard';
import Footer from '../components/Footer';
import FeedbackModal from '../components/FeedbackModal';

import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/events';
import { EventDate } from '../models/event';

const Home: React.FC = () => {
    const { data: events, isLoading, isError, refetch } = useQuery({
        queryKey: ['events'],
        queryFn: fetchEvents,
    });

    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        if (isError) {
            setShowErrorModal(true);
        }
    }, [isError]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-surface font-sans">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/60 font-medium">Cargando eventos...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-surface font-sans">
            <Navbar />

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                <FeaturedBanner event={events && events.length > 0 ? events[0] : undefined} />

                <section>
                    {events && events.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {events.map((event) => {
                                const eventDate = new EventDate(event.date);
                                const minPrice = event.ticketTypes && event.ticketTypes.length > 0
                                    ? Math.min(...event.ticketTypes.map(t => t.price))
                                    : 0;

                                return (
                                    <EventCard
                                        key={event.id}
                                        id={event.id}
                                        title={event.name}
                                        artist={event.artist}
                                        venue={event.venue}
                                        date={eventDate.formatted}
                                        time={eventDate.hour}
                                        price={minPrice}
                                        imageUrl={event.imageUrl}
                                        status={event.status}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-white/20">
                                <span className="material-symbols-rounded text-4xl">event_busy</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">No hay eventos disponibles</h2>
                            <p className="text-white/40 max-w-sm mx-auto">Vuelve más tarde para descubrir los mejores espectáculos y experiencias.</p>
                        </div>
                    )}
                </section>
            </main>

            <Footer />

            <FeedbackModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                type="error"
                title="¡Vaya! Algo salió mal"
                message="No pudimos cargar los eventos. Por favor, comprueba tu conexión e inténtalo de nuevo."
                actionLabel="Reintentar"
                onAction={() => refetch()}
            />
        </div>
    );
};

export default Home;
