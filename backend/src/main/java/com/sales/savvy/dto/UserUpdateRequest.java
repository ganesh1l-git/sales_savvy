package com.sales.savvy.dto;

import com.sales.savvy.entity.Role;
import com.sales.savvy.entity.UserStatus;
import jakarta.validation.constraints.Email;

public class UserUpdateRequest {
    @Email(message = "Email must be valid")
    private String email;

    private Role role;
    private UserStatus status;

    public UserUpdateRequest() {
    }

    public UserUpdateRequest(String email, Role role, UserStatus status) {
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}
