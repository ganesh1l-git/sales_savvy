package com.sales.savvy.service;

import com.sales.savvy.dto.AuthRequest;
import com.sales.savvy.dto.AuthResponse;
import com.sales.savvy.entity.JWTToken;
import com.sales.savvy.entity.User;
import com.sales.savvy.entity.UserStatus;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.exception.UnauthorizedException;
import com.sales.savvy.repository.JWTTokenRepository;
import com.sales.savvy.repository.UserRepository;
import com.sales.savvy.security.JwtService;
import com.sales.savvy.security.SecurityUtils;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${jwt.cookie-name:jwt_token}")
    private String cookieName = "jwt_token";

    public AuthService(UserRepository userRepository,
                       JWTTokenRepository jwtTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse login(AuthRequest request, HttpServletResponse response) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new UnauthorizedException("Account is inactive. Please contact administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        // Generate JWT
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());

        // Persist token in database
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusSeconds(jwtService.getExpirationMs() / 1000);
        JWTToken jwtToken = new JWTToken(user, token, now, expiresAt);
        jwtTokenRepository.save(jwtToken);

        // Set HttpOnly Cookie
        Cookie cookie = new Cookie(cookieName, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // set true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge((int) (jwtService.getExpirationMs() / 1000));
        response.addCookie(cookie);

        return new AuthResponse(
                "Login successful",
                user.getRole().name(),
                user.getUsername(),
                user.getUserId()
        );
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (cookieName.equals(c.getName())) {
                    token = c.getValue();
                    break;
                }
            }
        }

        if (token != null) {
            jwtTokenRepository.findByToken(token).ifPresent(jwtToken -> {
                jwtToken.setRevoked(true);
                jwtTokenRepository.save(jwtToken);
            });
        }

        // Clear HttpOnly cookie
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }

    public User getCurrentAuthenticatedUser() {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) {
            throw new UnauthorizedException("No authenticated user in session");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Authenticated user not found"));
    }
}
