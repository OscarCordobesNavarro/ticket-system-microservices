package com.ticket.system.booking.controller;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.dto.StockResponseDTO;
import com.ticket.system.booking.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody @Valid BookingRequestDTO bookingRequest, Authentication authentication) {
        Long authenticatedUserId = (Long) authentication.getDetails();
        if (!bookingRequest.getUserId().equals(String.valueOf(authenticatedUserId))) {
            throw new RuntimeException("No puedes realizar una reserva para otro usuario");
        }
        return bookingService.createBooking(bookingRequest);
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/user/{userId}")
    public List<BookingResponseDTO> getBookingsByUserId(@PathVariable String userId, Authentication authentication) {
        Long authenticatedUserId = (Long) authentication.getDetails();
        if (!userId.equals(String.valueOf(authenticatedUserId))) {
            throw new RuntimeException("No tienes permiso para ver las reservas de otro usuario");
        }
        return bookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/{id}")
    public BookingResponseDTO getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @PostMapping("/stock/init")
    public StockResponseDTO initStock(@RequestParam Long eventId, @RequestParam Long ticketTypeId,
            @RequestParam Integer quantity) {
        return bookingService.initStock(eventId, ticketTypeId, quantity);
    }

    @GetMapping("/stock/{eventId}/{ticketTypeId}")
    public Long getStock(@PathVariable Long eventId, @PathVariable Long ticketTypeId) {
        return bookingService.getStock(eventId, ticketTypeId);
    }
}