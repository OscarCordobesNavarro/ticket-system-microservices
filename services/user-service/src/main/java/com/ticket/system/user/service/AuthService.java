package com.ticket.system.user.service;

import com.ticket.system.user.dto.AuthResponse;
import com.ticket.system.user.dto.LoginRequest;
import com.ticket.system.user.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
