package com.ticket.system.booking.service;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;

public interface BookingService {
    
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequest);

    void setStock(Long eventId, Integer quantity);
    Long getStock(Long eventId);

    void cancelBooking(Long bookingId);
}
