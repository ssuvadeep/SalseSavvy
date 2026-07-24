package com.example.demo.controller;

import com.example.demo.entities.Order;
import com.example.demo.entities.User;
import com.example.demo.services.OrderService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Converts the user's cart into a PENDING Order.
     * Frontend calls this first, then calls /api/payments/create-order/{orderId}.
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(HttpServletRequest request) {

        try {
            User authenticatedUser = (User) request.getAttribute("authenticatedUser");

            if (authenticatedUser == null) {
                return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
            }

            Order order = orderService.checkout(authenticatedUser);

            return ResponseEntity.ok(Map.of(
                    "orderId", order.getOrderId(),
                    "totalAmount", order.getTotalAmount(),
                    "status", order.getStatus()
            ));

        } catch (IllegalStateException e) {

            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred"));
        }
    }

    /**
     * Fetch all successful orders for the authenticated user
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getOrdersForUser(HttpServletRequest request) {

        try {

            // Get authenticated user from JWT filter
            User authenticatedUser = (User) request.getAttribute("authenticatedUser");

            // If user not authenticated
            if (authenticatedUser == null) {
                return ResponseEntity
                        .status(401)
                        .body(Map.of("error", "User not authenticated"));
            }

            // Call service layer
            Map<String, Object> response =
                    orderService.getOrdersForUser(authenticatedUser);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(400)
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }
}