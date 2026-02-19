package com.ticket.system.catalog.service;

import com.ticket.system.catalog.dto.EventDTO;
import com.ticket.system.catalog.exception.EventNotFoundException;
import com.ticket.system.catalog.model.Event;
import com.ticket.system.catalog.repository.EventRepository;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;




@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public EventDTO getEventById(Long id) {
        return convertToDTO(eventRepository.findById(id).orElseThrow(() -> new EventNotFoundException(id)));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<EventDTO> findByArtist(String artist) {
        return eventRepository.findByArtistContainingIgnoreCase(artist).stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Override
    @Transactional
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = convertToEntity(eventDTO);
        return convertToDTO(eventRepository.save(event));
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventDTO> findByVenue(String venue) {
        return eventRepository.findByVenue(venue).stream()
                .map(this::convertToDTO)
                .toList();
    }

    private EventDTO convertToDTO(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .artist(event.getArtist())
                .venue(event.getVenue())
                .date(event.getDate())
                .description(event.getDescription())
                .build();
    }

    private Event convertToEntity(EventDTO eventDTO) {
        return Event.builder()
                .id(eventDTO.getId())
                .name(eventDTO.getName())
                .artist(eventDTO.getArtist())
                .venue(eventDTO.getVenue())
                .date(eventDTO.getDate())
                .description(eventDTO.getDescription())
                .build();
    }
}
