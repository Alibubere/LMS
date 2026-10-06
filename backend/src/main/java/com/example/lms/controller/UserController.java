package com.example.lms.controller;

import com.example.lms.dto.request.UserUpdateRequest;
import com.example.lms.dto.response.ApiResponse;
import com.example.lms.dto.response.UserResponse;
import com.example.lms.security.UserPrincipal;
import com.example.lms.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "User profile retrieval, updates, and admin user listing APIs")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user profile by ID")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse response = userService.getUserById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update user profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        UserResponse response = userService.updateUser(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("User updated successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all users (Admin only)")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}
