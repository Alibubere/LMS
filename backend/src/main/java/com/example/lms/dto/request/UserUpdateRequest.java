package com.example.lms.dto.request;

import jakarta.validation.constraints.Size;

public class UserUpdateRequest {

    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    private String bio;

    private String avatarUrl;

    @Size(min = 6, max = 100, message = "Password must be at least 6 characters")
    private String password;

    private String role; // Admin only

    public UserUpdateRequest() {}

    public UserUpdateRequest(String name, String bio, String avatarUrl, String password, String role) {
        this.name = name;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.password = password;
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
