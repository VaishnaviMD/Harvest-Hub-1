package com.harvesthub.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    private String name;
    private String email;
    private String password;
    
    @Column(name = "ph_no")
    private String phNo;
    
    private String location;
    private String type; // Farmer / Customer
    
    @Column(name = "register_date")
    private Date registerDate;

    // One-to-Many relationship with Products (farmer lists products)
    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Products> products;

    // One-to-Many relationship with Orders (user places orders)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Orders> orders;

    // One-to-Many relationship with Feedback (user gives feedback)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks;
}

