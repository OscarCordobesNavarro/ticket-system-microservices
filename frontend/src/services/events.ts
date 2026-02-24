import api from './api';
import type { Event } from '../models/event';

export const fetchEvents = async (): Promise<Event[]> => {
    const { data } = await api.get<Event[]>('/catalog/api/events');
    return data;
};

export const fetchEventById = async (id: number): Promise<Event> => {
    const { data } = await api.get<Event>(`/catalog/api/events/${id}`);
    return data;
};

export default api;
