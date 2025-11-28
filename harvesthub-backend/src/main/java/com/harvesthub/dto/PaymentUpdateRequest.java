package com.harvesthub.dto;

import lombok.Data;

@Data
public class PaymentUpdateRequest {
    private Long orderId;
    private Double amount;
    private String paymentMethod;
    private String gateway;
    private String transactionId;
    private String status;
}







