package com.harvesthub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "delivery")
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "del_id")
    private Long delId;

    @Column(name = "del_person")
    private String delPerson;
    
    private String status;
    private Double distance;
    
    @Column(name = "est_del_time")
    private Date estDelTime;
    
    @Column(name = "actual_del_time")
    private Date actualDelTime;

    // One-to-One relationship with Orders
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Orders order;
}

