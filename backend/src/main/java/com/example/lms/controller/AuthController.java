package com.example.lms.controller;

import com.example.lms.dto.request.LoginRequest;
import com.example.lms.dto.request.RegisterRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.AuthResponse;
import com.example.lms.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication", description = "User registration, login, and session termination APIs")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user (Learner, Instructor, or Admin)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse authResponse = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", authResponse), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Log out of session")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.successMessage("Logout successful"));
    }
}
