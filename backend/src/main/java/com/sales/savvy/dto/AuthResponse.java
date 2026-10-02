package com.sales.savvy.dto;

public class AuthResponse {
    private String message;
    private String role;
    private String username;
    private Long userId;

    public AuthResponse() {
    }

    public AuthResponse(String message, String role, String username, Long userId) {
        this.message = message;
        this.role = role;
        this.username = username;
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
