package com.ticket.system.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.ticket.system.booking.dto.EventDTO;

@FeignClient(name = "catalog-service")
public interface EventClient {
    @GetMapping("/api/events/{id}")
    EventDTO getEventById(@PathVariable("id") Long id);
}
