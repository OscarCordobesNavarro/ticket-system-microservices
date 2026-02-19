package com.ticket.system.booking.controller;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.service.BookingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public BookingResponseDTO createBooking(@RequestBody @Valid BookingRequestDTO bookingRequest) {
        return bookingService.createBooking(bookingRequest);
    }

    @PutMapping("/stock")
    public String initStock(@RequestParam Long eventId, @RequestParam Integer quantity) {
        bookingService.setStock(eventId, quantity);
        return "Stock inicializado para el evento " + eventId;
    }

    @GetMapping("/stock/{eventId}")
    public Long getStock(@PathVariable Long eventId) {
        return bookingService.getStock(eventId);
    }

}