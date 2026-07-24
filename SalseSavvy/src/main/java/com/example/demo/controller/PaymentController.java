package com.example.demo.controller;

import com.example.demo.dto.VerifyPaymentRequest;
import com.example.demo.services.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = "true")
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order/{orderId}")
    public ResponseEntity<Map<String, Object>> createOrder(@PathVariable String orderId) {
        try {
            Map<String, Object> response = paymentService.createPaymentOrder(orderId);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Could not create payment order"));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody VerifyPaymentRequest request) {
        try {
            boolean success = paymentService.verifyAndUpdatePayment(request);

            if (success) {
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified"));
            } else {
                return ResponseEntity.status(400).body(Map.of("status", "failed", "message", "Signature verification failed"));
            }

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Could not verify payment"));
        }
    }
}
