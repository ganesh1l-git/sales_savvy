package com.sales.savvy;

import com.sales.savvy.dto.AuthRequest;
import com.sales.savvy.dto.AuthResponse;
import com.sales.savvy.dto.RegisterRequest;
import com.sales.savvy.dto.UserResponse;
import com.sales.savvy.entity.Role;
import com.sales.savvy.entity.User;
import com.sales.savvy.entity.UserStatus;
import com.sales.savvy.exception.DuplicateResourceException;
import com.sales.savvy.exception.UnauthorizedException;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.JWTTokenRepository;
import com.sales.savvy.repository.UserRepository;
import com.sales.savvy.security.JwtService;
import com.sales.savvy.service.AuthService;
import com.sales.savvy.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletResponse;
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
    private JWTTokenRepository jwtTokenRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;
    private UserService userService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, jwtTokenRepository, passwordEncoder, jwtService);
        userService = new UserService(userRepository, jwtTokenRepository, cartItemRepository, passwordEncoder, authService);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest("testuser", "test@example.com", "Password@123", "CUSTOMER");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setUserId(1L);
            return u;
        });

        UserResponse response = userService.register(request);

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("test@example.com", response.getEmail());
        assertEquals(Role.CUSTOMER, response.getRole());
    }

    @Test
    void testRegisterDuplicateUsernameThrowsException() {
        RegisterRequest request = new RegisterRequest("existinguser", "test@example.com", "Password@123", "CUSTOMER");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> userService.register(request));
        assertEquals("Username already exists. Please choose another.", exception.getMessage());
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest("newuser", "existing@example.com", "Password@123", "CUSTOMER");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, () -> userService.register(request));
        assertEquals("Email is already registered. Try logging in.", exception.getMessage());
    }

    @Test
    void testLoginSuccess() {
        User user = new User("validuser", "valid@example.com", "encodedPassword", Role.CUSTOMER);
        user.setUserId(10L);
        user.setStatus(UserStatus.ACTIVE);

        AuthRequest request = new AuthRequest("validuser", "RawPassword@123");
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(userRepository.findByUsername("validuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("RawPassword@123", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken("validuser", "CUSTOMER")).thenReturn("jwt.token.here");
        when(jwtService.getExpirationMs()).thenReturn(3600000L);

        AuthResponse authResponse = authService.login(request, response);

        assertNotNull(authResponse);
        assertEquals("Login successful", authResponse.getMessage());
        assertEquals("CUSTOMER", authResponse.getRole());
        assertEquals("validuser", authResponse.getUsername());
        assertNotNull(response.getCookie("jwt_token"));
    }

    @Test
    void testLoginInvalidPasswordThrowsUnauthorized() {
        User user = new User("validuser", "valid@example.com", "encodedPassword", Role.CUSTOMER);
        user.setStatus(UserStatus.ACTIVE);

        AuthRequest request = new AuthRequest("validuser", "WrongPassword");
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(userRepository.findByUsername("validuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "encodedPassword")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request, response));
    }
}
