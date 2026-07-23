package com.example.demo.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_tokens")
public class JWTToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer tokenId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 500)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    // 🔹 Default Constructor (Required by JPA)
    public JWTToken() {
    }

    // 🔹 Constructor with all fields
    public JWTToken(Integer tokenId, User user, String token, LocalDateTime expiresAt) {
        this.tokenId = tokenId;
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    // 🔹 Constructor without tokenId (for auto-generation)
    public JWTToken(User user, String token, LocalDateTime expiresAt) {
        this.user = user;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    // =====================
    // Getters and Setters
    // =====================

    public Integer getTokenId() {
        return tokenId;
    }

    public void setTokenId(Integer tokenId) {
        this.tokenId = tokenId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
