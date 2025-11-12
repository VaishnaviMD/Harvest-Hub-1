package com.harvesthub.controller;

import com.harvesthub.dto.PaymentRequest;
import com.harvesthub.service.PaymentGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments/gateway")
@CrossOrigin(origins = "*")
public class PaymentGatewayController {

    @Autowired
    private PaymentGatewayService paymentGatewayService;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentRequest request) {
        Map<String, Object> order = paymentGatewayService.createOrder(
                request.getAmount(),
                request.getCurrency(),
                request.getReceipt()
        );
        if (order != null) {
            return ResponseEntity.ok(order);
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> paymentData) {
        boolean verified = paymentGatewayService.verifyPayment(
                paymentData.get("orderId"),
                paymentData.get("paymentId"),
                paymentData.get("signature")
        );
        Map<String, Object> response = Map.of("verified", verified);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/capture")
    public ResponseEntity<Map<String, Object>> capturePayment(@RequestBody Map<String, Object> captureData) {
        Map<String, Object> result = paymentGatewayService.capturePayment(
                (String) captureData.get("paymentId"),
                ((Number) captureData.get("amount")).doubleValue()
        );
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().build();
    }
}

