package com.ticket.system.booking.service;

import com.ticket.system.booking.dto.BookingRequestDTO;
import com.ticket.system.booking.dto.BookingResponseDTO;
import com.ticket.system.booking.dto.StockResponseDTO;
import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO bookingRequest);

    StockResponseDTO initStock(Long eventId, Long ticketTypeId, Integer quantity);

    Long getStock(Long eventId, Long ticketTypeId);

    void cancelBooking(Long bookingId);

    void confirmBooking(Long bookingId);

    List<BookingResponseDTO> getBookingsByUserId(String userId);

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO getBookingById(Long id);

    void setStock(Long eventId, Long ticketTypeId, Integer quantity);
}
