package com.ticket.system.booking.controller;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.dto.StockResponseDTO;
import com.ticket.system.booking.service.BookingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "API para gestión de reservas de entradas")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Crear una nueva reserva")
    @ApiResponse(responseCode = "201", description = "Reserva creada y en estado PENDING")
    @ApiResponse(responseCode = "400", description = "Stock insuficiente o datos inválidos")
    @ApiResponse(responseCode = "401", description = "No autenticado")
    @ApiResponse(responseCode = "409", description = "Usuario no válido")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody @Valid BookingRequestDTO bookingRequest,
            Authentication authentication) {

        Long authenticatedUserId = (Long) authentication.getDetails();
        // Autorización: un usuario solo puede crear reservas para sí mismo
        if (!bookingRequest.getUserId().equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(bookingRequest));
    }

    @GetMapping
    @Operation(summary = "Obtener todas las reservas", description = "Solo para administración interna")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Obtener reservas de un usuario")
    @ApiResponse(responseCode = "200", description = "Lista de reservas del usuario")
    @ApiResponse(responseCode = "403", description = "Intento de ver reservas de otro usuario")
    public ResponseEntity<List<BookingResponseDTO>> getBookingsByUserId(
            @PathVariable Long userId,
            Authentication authentication) {

        Long authenticatedUserId = (Long) authentication.getDetails();
        // Autorización: un usuario solo puede ver sus propias reservas
        if (!userId.equals(authenticatedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener una reserva por ID")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancelar una reserva")
    @ApiResponse(responseCode = "204", description = "Reserva cancelada")
    @ApiResponse(responseCode = "409", description = "La reserva no está en estado PENDING")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/stock/init")
    @Operation(summary = "Inicializar stock de un tipo de entrada en Redis")
    public ResponseEntity<StockResponseDTO> initStock(
            @RequestParam Long eventId,
            @RequestParam Long ticketTypeId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(bookingService.initStock(eventId, ticketTypeId, quantity));
    }

    @GetMapping("/stock/{eventId}/{ticketTypeId}")
    @Operation(summary = "Consultar stock disponible de un tipo de entrada")
    public ResponseEntity<Long> getStock(
            @PathVariable Long eventId,
            @PathVariable Long ticketTypeId) {
        return ResponseEntity.ok(bookingService.getStock(eventId, ticketTypeId));
    }
}