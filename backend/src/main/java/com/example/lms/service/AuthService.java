package com.example.lms.service;

import com.example.lms.dto.request.LoginRequest;
import com.example.lms.dto.request.RegisterRequest;
import com.example.lms.dto.response.AuthResponse;
import com.example.lms.dto.response.UserResponse;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.exception.UnauthorizedException;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResourceConflictException("An account with email " + request.getEmail() + " already exists");
        }

        User.Role role = User.Role.LEARNER;
        if (request.getRole() != null && !request.getRole().isBlank()) {
            try {
                role = User.Role.valueOf(request.getRole().trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                role = User.Role.LEARNER;
            }
        }

        User user = new User(
            null,
            request.getName().trim(),
            request.getEmail().trim().toLowerCase(),
            passwordEncoder.encode(request.getPassword()),
            role
        );

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromUser(savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name());

        return new AuthResponse(token, UserResponse.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail().trim().toLowerCase(),
                    request.getPassword()
                )
            );

            String token = tokenProvider.generateToken(authentication);
            User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

            return new AuthResponse(token, UserResponse.fromEntity(user));
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }
    }
}
