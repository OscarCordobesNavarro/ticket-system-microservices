import axios from 'axios';
import type { Event } from '../models/event';

const API_GATEWAY_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_GATEWAY_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchEvents = async (): Promise<Event[]> => {
    const { data } = await api.get<Event[]>('/catalog/api/events');
    return data;
};

export const fetchEventById = async (id: number): Promise<Event> => {
    const { data } = await api.get<Event>(`/catalog/api/events/${id}`);
    return data;
};

export default api;
