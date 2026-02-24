export interface BookingRequest {
    eventId: number;
    ticketTypeId: number;
    userId: string;
    quantity: number;
}

export interface BookingResponse {
    id: string;
    eventId: number;
    ticketTypeId: number;
    userId: string;
    quantity: number;
    status: string;
    createdAt: string;
    expiresAt: string;
}
