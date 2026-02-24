export interface BookingRequest {
    eventId: number;
    ticketTypeId: number;
    userId: number;
    quantity: number;
}

export interface BookingResponse {
    id: number;
    eventId: number;
    ticketTypeId: number;
    userId: number;
    quantity: number;
    status: string;
    createdAt: string;
    expiresAt: string;
}
