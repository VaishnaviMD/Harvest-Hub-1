package com.harvesthub.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {
    private String address;
    private String paymentMethod;
    private List<OrderItemRequest> items;
    
    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private Double price;
    }
}

