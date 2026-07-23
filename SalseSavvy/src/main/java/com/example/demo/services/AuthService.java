package com.example.demo.services;

import java.time.LocalDateTime;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entities.JWTToken;
import com.example.demo.entities.User;
import com.example.demo.repositories.JWTTokenRepository;
import com.example.demo.repositories.UserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.nio.charset.StandardCharsets;

@Service
public class AuthService {

    private final Key SIGNING_KEY;
    private final UserRepository userRepository;
    private final JWTTokenRepository jwtTokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // Inject jwt.secret from application.properties
    public AuthService(UserRepository userRepository,
                       JWTTokenRepository jwtTokenRepository,
                       @Value("${jwt.secret}") String jwtSecret) {

        this.userRepository = userRepository;
        this.jwtTokenRepository = jwtTokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();

        // Ensure secret is at least 64 bytes for HS512
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
            throw new IllegalArgumentException(
                "JWT_SECRET must be at least 64 bytes for HS512 algorithm"
            );
        }

        this.SIGNING_KEY = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // ================= AUTHENTICATE USER =================

    public User authenticate(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return user;
    }

    // ================= GENERATE TOKEN =================

    public String generateToken(User user) {

        String token;
        LocalDateTime now = LocalDateTime.now();

        JWTToken existingToken =
                jwtTokenRepository.findByUserId(user.getUserId());

        if (existingToken != null && now.isBefore(existingToken.getExpiresAt())) {
            token = existingToken.getToken();
        } else {

            token = generateNewToken(user);

            if (existingToken != null) {
                jwtTokenRepository.delete(existingToken);
            }

            saveToken(user, token);
        }

        return token;
    }

    // ================= CREATE NEW JWT =================

    private String generateNewToken(User user) {

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole().name())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }

    // ================= SAVE TOKEN IN DB =================

    public void saveToken(User user, String token) {

        JWTToken jwtToken = new JWTToken(
                user,
                token,
                LocalDateTime.now().plusHours(1)
        );

        jwtTokenRepository.save(jwtToken);
    }

 // ================= VALIDATE TOKEN =================

public boolean validateToken(String token) {

    try {
        Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token);

        return true;

    } catch (Exception e) {
        System.err.println("Invalid JWT Token: " + e.getMessage());
        return false;
    }
}

// ================= EXTRACT USERNAME =================

public String extractUsername(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(SIGNING_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
}

public void logout(User user) {
    int userId = user.getUserId();
    JWTToken token = jwtTokenRepository.findByUserId(userId);
    if (token != null) {
        jwtTokenRepository.delete(token);
    }
}
}