package com.example.demo.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.entities.User;
import com.example.demo.services.AuthService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest,
                                   HttpServletResponse response) {

        try {

            // Authenticate user
            User user = authService.authenticate(
                    loginRequest.getUsername(),
                    loginRequest.getPassword()
            );

            // Generate JWT
            String token = authService.generateToken(user);

            // Create Cookie
            Cookie cookie = new Cookie("authToken", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // Set true in production (HTTPS)
            cookie.setPath("/");
            cookie.setMaxAge(3600); // 1 hour
            response.addCookie(cookie);

            // Optional SameSite=None header (for cross-origin)
            response.addHeader("Set-Cookie",
                    String.format("authToken=%s; HttpOnly; Path=/; Max-Age=3600; SameSite=None", token)
            );

            // Response body
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("message", "Login successful");
            responseBody.put("username", user.getUsername());
            responseBody.put("role", user.getRole().name());

            return ResponseEntity.ok(responseBody);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }
  
    // ================= LOGOUT =================

    @PostMapping("/logout")
public ResponseEntity<Map<String, String>> logout(HttpServletRequest request, HttpServletResponse response) {

    try {

        // Get authenticated user from request (set by JWT filter)
        User user = (User) request.getAttribute("authenticatedUser");

        // Call service to handle logout logic
        authService.logout(user);

        // Remove auth token cookie
        Cookie cookie = new Cookie("authToken", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");

        response.addCookie(cookie);

        // Success response
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "Logout successful");

        return ResponseEntity.ok(responseBody);

    } catch (RuntimeException e) {

        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", "Logout failed");

        return ResponseEntity.status(500).body(errorResponse);
    }
}

}