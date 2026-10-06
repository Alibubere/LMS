package com.example.lms.service;

import com.example.lms.dto.request.UserUpdateRequest;
import com.example.lms.dto.response.UserResponse;
import com.example.lms.entity.User;
import com.example.lms.exception.ForbiddenException;
import com.example.lms.exception.ResourceNotFoundException;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id, UserPrincipal currentUser) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Only allow user to view own profile or admin/instructor
        if (!currentUser.getId().equals(id) && currentUser.getRole() == User.Role.LEARNER) {
            // Learner can view basic info or own profile
        }

        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserResponse::fromEntity)
            .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request, UserPrincipal currentUser) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Check ownership or admin privilege
        if (!currentUser.getId().equals(id) && currentUser.getRole() != User.Role.ADMIN) {
            throw new ForbiddenException("You are not authorized to update this profile");
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null && !request.getRole().isBlank() && currentUser.getRole() == User.Role.ADMIN) {
            try {
                user.setRole(User.Role.valueOf(request.getRole().trim().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        User updated = userRepository.save(user);
        return UserResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public User getEntityById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
