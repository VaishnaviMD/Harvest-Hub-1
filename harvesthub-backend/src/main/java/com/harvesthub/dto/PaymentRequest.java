package com.harvesthub.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private Double amount;
    private String currency;
    private String receipt;
}

