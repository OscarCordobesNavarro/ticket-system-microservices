import api from './api';
import type { BookingRequest, BookingResponse } from '../models/booking';

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

export const fetchBookingsByUserId = async (userId: string): Promise<BookingResponse[]> => {
    const { data } = await api.get<BookingResponse[]>(`/booking/api/bookings/user/${userId}`);
    return data;
};

export default api;
