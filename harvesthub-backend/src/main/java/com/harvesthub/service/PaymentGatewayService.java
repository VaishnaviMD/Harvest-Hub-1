package com.harvesthub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentGatewayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.api.url}")
    private String razorpayApiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public PaymentGatewayService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Create a Razorpay order
     */
    public Map<String, Object> createOrder(Double amount, String currency, String receipt) {
        try {
            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            Map<String, Object> orderData = new HashMap<>();
            orderData.put("amount", (int)(amount * 100)); // Convert to paise
            orderData.put("currency", currency != null ? currency : "INR");
            orderData.put("receipt", receipt);

            String response = webClient.post()
                    .uri(razorpayApiUrl + "/orders")
                    .header("Authorization", "Basic " + encodedAuth)
                    .header("Content-Type", "application/json")
                    .bodyValue(orderData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            Map<String, Object> result = new HashMap<>();
            result.put("orderId", jsonNode.get("id").asText());
            result.put("amount", jsonNode.get("amount").asDouble() / 100.0);
            result.put("currency", jsonNode.get("currency").asText());
            result.put("keyId", razorpayKeyId);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * Verify payment signature
     */
    public boolean verifyPayment(String orderId, String paymentId, String signature) {
        try {
            // In production, use Razorpay's signature verification
            // For now, we'll do a basic check
            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            String response = webClient.get()
                    .uri(razorpayApiUrl + "/payments/" + paymentId)
                    .header("Authorization", "Basic " + encodedAuth)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("order_id").asText().equals(orderId) 
                    && jsonNode.get("status").asText().equals("authorized");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Capture payment
     */
    public Map<String, Object> capturePayment(String paymentId, Double amount) {
        try {
            String auth = razorpayKeyId + ":" + razorpayKeySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

            Map<String, Object> captureData = new HashMap<>();
            captureData.put("amount", (int)(amount * 100));

            String response = webClient.post()
                    .uri(razorpayApiUrl + "/payments/" + paymentId + "/capture")
                    .header("Authorization", "Basic " + encodedAuth)
                    .header("Content-Type", "application/json")
                    .bodyValue(captureData)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            Map<String, Object> result = new HashMap<>();
            result.put("paymentId", jsonNode.get("id").asText());
            result.put("status", jsonNode.get("status").asText());
            result.put("amount", jsonNode.get("amount").asDouble() / 100.0);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

