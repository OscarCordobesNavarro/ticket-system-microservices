import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface BookingRequest {
    eventId: number;
    userId: string;
    quantity: number;
}

export interface BookingResponse {
    bookingId: string;
    eventId: number;
    userId: string;
    quantity: number;
    totalAmount: number;
    status: string;
    bookingDate: string;
}

export const createBooking = async (request: BookingRequest): Promise<BookingResponse> => {
    const { data } = await api.post<BookingResponse>('/booking/api/bookings', request);
    return data;
};

export const fetchStock = async (eventId: number): Promise<number> => {
    const { data } = await api.get<number>(`/booking/api/bookings/stock/${eventId}`);
    return data;
};
