import axios from 'axios';
import type { BookingRequest, BookingResponse } from '../models/booking';

const API_GATEWAY_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createBooking = async (request: BookingRequest): Promise<BookingResponse> => {
    const { data } = await api.post<BookingResponse>('/booking/api/bookings', request);
    return data;
};

export const fetchStock = async (eventId: number, ticketTypeId: number): Promise<number> => {
    const { data } = await api.get<number>(`/booking/api/bookings/stock/${eventId}/${ticketTypeId}`);
    return data;
};

export const fetchBookingById = async (id: string): Promise<BookingResponse> => {
    const { data } = await api.get<BookingResponse>(`/booking/api/bookings/${id}`);
    return data;
};

export default api;
