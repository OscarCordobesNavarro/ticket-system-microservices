package com.ticket.system.catalog.service;

import java.util.List;

import com.ticket.system.catalog.dto.EventDTO;

public interface EventService {

    List<EventDTO> getAllEvents();
    EventDTO getEventById(Long id);
    EventDTO createEvent(EventDTO event);
    List<EventDTO> findByArtist(String artist);
    List<EventDTO> findByVenue(String venue);
}
