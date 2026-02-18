package com.ticket.system.booking.controller;

import com.ticket.system.booking.model.Booking;
import com.ticket.system.booking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final StringRedisTemplate redisTemplate;

    @PostMapping
    public Booking createBooking(@RequestParam Long eventId,
            @RequestParam String userId,
            @RequestParam Integer quantity) {
        return bookingService.createBooking(eventId, userId, quantity);
    }

    // Endpoint temporal para inicializar el stock en Redis
    // Ejemplo: PUT /api/bookings/stock?eventId=1&quantity=100
    @PutMapping("/stock")
    public String initStock(@RequestParam Long eventId, @RequestParam Integer quantity) {
        redisTemplate.opsForValue().set("event:stock:" + eventId, String.valueOf(quantity));
        return "Stock inicializado para el evento " + eventId + ": " + quantity + " entradas.";
    }

    // Para consultar cuánto stock queda en Redis
    @GetMapping("/stock/{eventId}")
    public String getStock(@PathVariable Long eventId) {
        String stock = redisTemplate.opsForValue().get("event:stock:" + eventId);
        return stock != null ? stock : "0 (No inicializado)";
    }
}