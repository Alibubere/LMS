package com.example.lms.service;

import com.example.lms.dto.request.LoginRequest;
import com.example.lms.dto.request.RegisterRequest;
import com.example.lms.dto.response.AuthResponse;
import com.example.lms.entity.User;
import com.example.lms.exception.ResourceConflictException;
import com.example.lms.exception.UnauthorizedException;
import com.example.lms.repository.UserRepository;
import com.example.lms.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(1L, "Test Learner", "learner@test.com", "encodedPassword", User.Role.LEARNER);
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest("Test Learner", "learner@test.com", "password123", "LEARNER");

        when(userRepository.existsByEmail("learner@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromUser(1L, "learner@test.com", "LEARNER")).thenReturn("jwt.token.here");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("learner@test.com", response.getUser().getEmail());
        assertEquals("LEARNER", response.getUser().getRole());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest("Test Learner", "learner@test.com", "password123", "LEARNER");

        when(userRepository.existsByEmail("learner@test.com")).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest("learner@test.com", "password123");
        Authentication auth = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.here");
        when(userRepository.findByEmail("learner@test.com")).thenReturn(Optional.of(sampleUser));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt.token.here", response.getToken());
        assertEquals("learner@test.com", response.getUser().getEmail());
    }

    @Test
    void login_InvalidCredentials_ThrowsUnauthorized() {
        LoginRequest request = new LoginRequest("learner@test.com", "wrongpass");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}
