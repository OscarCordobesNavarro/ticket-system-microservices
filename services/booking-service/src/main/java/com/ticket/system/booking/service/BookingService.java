package com.ticket.system.booking.service;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.dto.StockResponseDTO;

public interface BookingService {
    
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequest);

    StockResponseDTO setStock(Long eventId, Integer quantity);
    Long getStock(Long eventId);

    void cancelBooking(Long bookingId);
}
