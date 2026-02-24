package com.ticket.system.user.service;

import com.ticket.system.user.dto.UserDTO;
import com.ticket.system.user.exception.UserNotFoundException;
import com.ticket.system.user.model.User;
import com.ticket.system.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        log.info("Buscando usuario con ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado"));
        return convertToDTO(user);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean validateUser(Long id) {
        boolean exists = userRepository.existsById(id);
        log.debug("Validación de usuario ID {}: {}", id, exists);
        return exists;
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
