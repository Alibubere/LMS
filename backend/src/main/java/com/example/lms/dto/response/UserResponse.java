package com.example.lms.dto.response;

import com.example.lms.entity.User;
import java.time.LocalDateTime;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String bio;
    private String avatarUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponse() {}

    public UserResponse(Long id, String name, String email, String role, String bio, String avatarUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static UserResponse fromEntity(User user) {
        if (user == null) return null;
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name(),
            user.getBio(),
            user.getAvatarUrl(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
