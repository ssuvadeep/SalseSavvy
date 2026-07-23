package com.example.demo.controller;

import com.example.demo.entities.User;
import com.example.demo.services.CartService;
import com.example.demo.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    private UserRepository userRepository;

    // Fetch all cart items for the authenticated user
    @GetMapping("/items")
    public ResponseEntity<?> getCartItems(HttpServletRequest request) {

        // Get authenticated user from request (set by JWT filter)
        User user = (User) request.getAttribute("authenticatedUser");

        if (user == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }

        // Call service to get cart items
        Map<String, Object> cartItems = cartService.getCartItems(user.getUserId());

        return ResponseEntity.ok(cartItems);
    }
}
 