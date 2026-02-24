package com.ticket.system.user.service;

import com.ticket.system.user.dto.UserDTO;

public interface UserService {
    UserDTO getUserById(Long id);
    boolean validateUser(Long id);
}
