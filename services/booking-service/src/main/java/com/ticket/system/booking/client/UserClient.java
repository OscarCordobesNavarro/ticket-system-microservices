package com.ticket.system.booking.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service") // El nombre que tiene en Eureka
public interface UserClient {

    @GetMapping("/api/users/validate/{id}")
    Boolean validateUser(@PathVariable("id") Long id);
}