package com.ticket.system.payment.service;

import com.ticket.system.payment.dto.BookingCreatedEvent;

public interface PaymentService {
    void processPayment(BookingCreatedEvent bookingData);
}
