package com.sales.savvy.service;

import com.sales.savvy.dto.RegisterRequest;
import com.sales.savvy.dto.UserResponse;
import com.sales.savvy.dto.UserUpdateRequest;
import com.sales.savvy.entity.Role;
import com.sales.savvy.entity.User;
import com.sales.savvy.entity.UserStatus;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.exception.DuplicateResourceException;
import com.sales.savvy.exception.ResourceNotFoundException;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.JWTTokenRepository;
import com.sales.savvy.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final CartItemRepository cartItemRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthService authService;

    public UserService(UserRepository userRepository,
                       JWTTokenRepository jwtTokenRepository,
                       CartItemRepository cartItemRepository,
                       PasswordEncoder passwordEncoder,
                       AuthService authService) {
        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.cartItemRepository = cartItemRepository;
        this.passwordEncoder = passwordEncoder;
        this.authService = authService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists. Please choose another.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered. Try logging in.");
        }

        // Customer self-registration defaults strictly to CUSTOMER role
        User user = new User(
                request.getUsername().trim(),
                request.getEmail().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.CUSTOMER
        );

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    public UserResponse getCurrentUserProfile() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        return new UserResponse(currentUser);
    }

    @Transactional
    public UserResponse updateCurrentUserProfile(UserUpdateRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equalsIgnoreCase(currentUser.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email is already registered. Try logging in.");
            }
            currentUser.setEmail(request.getEmail().trim());
        }

        User updatedUser = userRepository.save(currentUser);
        return new UserResponse(updatedUser);
    }

    // Admin operations
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserResponse(user);
    }

    @Transactional
    public UserResponse updateUserByAdmin(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Safeguard: Do not deactivate or demote the last ADMIN
        if (user.getRole() == Role.ADMIN) {
            boolean demoting = request.getRole() != null && request.getRole() != Role.ADMIN;
            boolean deactivating = request.getStatus() != null && request.getStatus() != UserStatus.ACTIVE;
            if (demoting || deactivating) {
                long activeAdminCount = userRepository.findAll().stream()
                        .filter(u -> u.getRole() == Role.ADMIN && u.getStatus() == UserStatus.ACTIVE)
                        .count();
                if (activeAdminCount <= 1) {
                    throw new BadRequestException("Cannot modify this administrator account as it is the only active administrator in the system.");
                }
            }
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            if (!request.getEmail().equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email is already registered. Try logging in.");
            }
            user.setEmail(request.getEmail().trim());
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }

    @Transactional
    public void deleteUserByAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Safeguard: Do not delete the last ADMIN
        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new BadRequestException("Cannot delete the only remaining administrator account.");
            }
        }

        // Clean up cart items and tokens before deleting user
        cartItemRepository.deleteByUserUserId(userId);
        jwtTokenRepository.deleteByUser(user);
        userRepository.delete(user);
    }
}
