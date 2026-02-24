import React from 'react';
import AccountLayout from '../components/AccountLayout';

// Mock data for initial implementation
const mockTickets = [
    {
        id: 'T1',
        type: 'CONCERT',
        artist: 'The Weeknd: After Hours Til Dawn',
        venue: 'SoFi Stadium, CA',
        date: 'Sat, Nov 18, 2024',
        time: '8:00 PM',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf5JLnbnl_YUeLuoiBYaPBjdQyS6Os4-P0ujKJAtdhfbD2wvdYM9J8JX3aJ3TRnEyFwyGfrMRUwNMCiHux92ctAWZVbjkFSCsTmtXFQ1jVc22Y82PTbIk2I2mq3c97ooCWIddOFJNMDOL9p1FR3S_jwDiX1mDzNJ7GIPLVrc04oGk97z0E_2fuAqHOY5SrtricE11znROQ2C1DExRYI0zxww_23L0bpB_3bb-B3CAOoJA67fbg8djc9lOLViU1ap-qRqiv9w58s4bE',
        quantity: 2,
        section: '112',
        row: 'A',
        seats: '14-15',
        icon: 'music_note'
    },
    {
        id: 'T2',
        type: 'SPORTS',
        artist: 'NBA: Lakers vs. Celtics',
        venue: 'Crypto.com Arena, LA',
        date: 'Tue, Dec 05, 2024',
        time: '7:30 PM',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJf_hcwULzxJTmGWx-tLMLhHtEF5rS6osOd60bpktAXfD6RqDqzaovqQZAnzxLButecZYytrX3kGINZ5Zb-qedt0nL5Q_yEiovZy_aP08NDMYYWoFYAc6D7uEutjSa5PPI-sMgKH0iSGV-e9WadAdS55-Fr75RY-cYT_fAm20YutUljCvCGK_mnH3F-vE17PAdw97m2RYXkrR7J9z7m2uE1i0YxVEcEkdN7-kqF8q7Au4rgT6IMGyLekwhCmlkclFcFVg8xy-Blj9d',
        quantity: 4,
        section: '205',
        row: 'K',
        seats: '8-11',
        icon: 'sports_basketball'
    }
];

const MyTickets: React.FC = () => {
    return (
        <AccountLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-navy-dark">Mis Entradas</h1>
                    <p className="text-slate-500 mt-1">Gestiona tus próximos eventos y entradas.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filtrar
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {mockTickets.length > 0 ? (
                    mockTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-classic hover:shadow-classic-hover transition-all duration-300 flex flex-col md:flex-row">
                            <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0 bg-slate-100">
                                <img
                                    src={ticket.image}
                                    alt={ticket.artist}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-navy-dark/10"></div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-navy-dark text-[10px] font-bold px-3 py-1 rounded shadow-sm">
                                    {ticket.quantity} ENTRADAS
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                                            <span className="material-symbols-outlined text-lg">{ticket.icon}</span>
                                            <span>{ticket.type}</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-navy-dark">{ticket.artist}</h2>
                                        <div className="flex flex-wrap gap-y-2 gap-x-6 mt-3 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
                                                <span className="font-medium">{ticket.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
                                                <span>{ticket.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">location_on</span>
                                                <span>{ticket.venue}</span>
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
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="px-3 py-1 bg-slate-100 rounded text-slate-700 font-medium border border-slate-200">
                                            <span className="text-xs text-slate-500 uppercase mr-1">Sec</span>
                                            {ticket.section}
                                        </div>
                                        <div className="px-3 py-1 bg-slate-100 rounded text-slate-700 font-medium border border-slate-200">
                                            <span className="text-xs text-slate-500 uppercase mr-1">Fila</span>
                                            {ticket.row}
                                        </div>
                                        <div className="px-3 py-1 bg-slate-100 rounded text-slate-700 font-medium border border-slate-200">
                                            <span className="text-xs text-slate-500 uppercase mr-1">Asientos</span>
                                            {ticket.seats}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex-1 md:flex-none px-4 py-2 border border-slate-300 text-slate-700 rounded text-sm font-semibold hover:bg-slate-50 hover:text-navy-dark transition-colors flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">send_to_mobile</span>
                                            Transferir
                                        </button>
                                        <button className="flex-1 md:flex-none px-4 py-2 bg-primary text-white rounded text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">download</span>
                                            Descargar PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                        <div className="size-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <span className="material-symbols-outlined text-3xl text-slate-300">confirmation_number</span>
                        </div>
                        <h3 className="text-lg font-bold text-navy-dark">No tienes entradas aún</h3>
                        <p className="text-slate-500 mt-2">Cuando compres entradas para un evento, aparecerán aquí.</p>
                        <button className="mt-6 px-6 py-2 bg-primary text-white rounded-md font-bold hover:bg-primary-dark transition-colors">
                            Explorar Eventos
                        </button>
                    </div>
                )}

                {/* Past Events Section */}
                <div className="pt-8 border-t border-slate-200">
                    <h2 className="text-lg font-bold text-slate-400 mb-6 uppercase tracking-wider px-2">Eventos Pasados</h2>
                    <div className="space-y-6 opacity-75">
                        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-classic flex flex-col md:flex-row grayscale">
                            <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0 bg-slate-100">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_bueBj5HlsrS9d4Bf2dEUG45bdLQJFt0hZhMafaP2sb7oKLJ_x8N48NRF96RG-q_fpApBuSaBDxTuzkkzkUOgmilniFWV_-oPRciyzLs-SZbpeFhDTJyb9Z3IDCk2CEGe6VhHicnzl5UYOmAu4vzIO82Q5fuRQJ6gYaBQmXjuaZVe6il255L9hUeqKS9ZB6Q2S0BEVhL4e9pKqnAhnqgd4v-w1pyoU6vX5w6C0Pgaa2TQ8P4LE5XP1tR1Q6YvOtEFXWYxqaMInm1Y"
                                    alt="Dave Chappelle"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-navy-dark/10"></div>
                                <div className="absolute top-3 left-3 bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded shadow-sm">
                                    EVENTO FINALIZADO
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between bg-slate-50/50">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs mb-1">
                                            <span className="material-symbols-outlined text-lg">mic_external_on</span>
                                            <span>COMEDIA</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-600">Dave Chappelle: Live</h2>
                                        <div className="flex flex-wrap gap-y-2 gap-x-6 mt-3 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">event_available</span>
                                                <span className="font-medium">Oct 12, 2024</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">schedule</span>
                                                <span>9:00 PM</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-slate-400 text-[18px]">location_on</span>
                                                <span>Hollywood Bowl, CA</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span className="material-symbols-outlined">info</span>
                                        <span>Este evento ha finalizado.</span>
                                    </div>
                                    <button className="px-4 py-2 border border-slate-300 text-slate-500 rounded text-sm font-semibold hover:bg-white hover:text-navy-dark transition-colors bg-white">
                                        Ver Recibo
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
};

export default MyTickets;
