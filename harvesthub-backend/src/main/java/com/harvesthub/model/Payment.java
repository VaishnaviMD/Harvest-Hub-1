package com.harvesthub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pay_id")
    private Long payId;

    @Column(name = "pay_gateway")
    private String payGateway;
    
    @Column(name = "mode_of_pay")
    private String modeOfPay;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    private Double amount;
    
    @Column(name = "pay_status")
    private String payStatus;
    
    @Column(name = "pay_date")
    private Date payDate;

    // One-to-One relationship with Orders
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Orders order;
}

