export const EventStatus = {
    AVAILABLE: 'AVAILABLE',
    LOW_STOCK: 'LOW_STOCK',
    SOLD_OUT: 'SOLD_OUT',
    NOT_AVAILABLE: 'NOT_AVAILABLE',
    CANCELLED: 'CANCELLED',
} as const;

export type EventStatus = typeof EventStatus[keyof typeof EventStatus];

export class EventDate {
    private date: string;

    constructor(date: string) {
        this.date = date;
    }

    get raw(): string {
        return this.date;
    }

    get formatted(): string {
        return new Date(this.date).toLocaleDateString('es-ES', {
            month: 'short',
            day: '2-digit',
        }).toUpperCase();
    }

    get hour(): string {
        const parts = new Date(this.date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        }).split(':');
        return `${parts[0]}:${parts[1]}`;
    }
}

export interface TicketType {
    id: number;
    name: string;
    description: string;
    price: number;
    capacity: number;
}

export interface Event {
    id: number;
    name: string;
    artist: string;
    venue: string;
    date: string;
    description: string;
    ticketTypes: TicketType[];
    imageUrl: string;
    status: EventStatus;
}
