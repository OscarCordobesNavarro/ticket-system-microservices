package com.ticket.system.catalog.controller;

import com.ticket.system.catalog.dto.EventDTO;
import com.ticket.system.catalog.service.EventService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "API para gestión del catálogo de eventos")
public class EventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "Obtener todos los eventos", description = "Devuelve la lista completa de eventos disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de eventos obtenida correctamente")
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener evento por ID")
    @ApiResponse(responseCode = "200", description = "Evento encontrado")
    @ApiResponse(responseCode = "404", description = "Evento no encontrado")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo evento", description = "Requiere autenticación. Crea un evento en el catálogo.")
    @ApiResponse(responseCode = "201", description = "Evento creado correctamente")
    @ApiResponse(responseCode = "400", description = "Datos del evento inválidos")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    public ResponseEntity<EventDTO> createEvent(@RequestBody @Valid EventDTO eventDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(eventDTO));
    }

    @GetMapping("/search/artist")
    @Operation(summary = "Buscar eventos por artista", description = "Búsqueda parcial e insensible a mayúsculas")
    @ApiResponse(responseCode = "200", description = "Eventos encontrados")
    public ResponseEntity<List<EventDTO>> findByArtist(@RequestParam String artist) {
        return ResponseEntity.ok(eventService.findByArtist(artist));
    }

    @GetMapping("/search/venue")
    @Operation(summary = "Buscar eventos por recinto", description = "Búsqueda parcial e insensible a mayúsculas")
    @ApiResponse(responseCode = "200", description = "Eventos encontrados")
    public ResponseEntity<List<EventDTO>> findByVenue(@RequestParam String venue) {
        return ResponseEntity.ok(eventService.findByVenue(venue));
    }
}