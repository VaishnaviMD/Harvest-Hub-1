package com.harvesthub.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "products")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Products {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    private String name;
    private String category;
    private Double price;

    @Column(columnDefinition = "TEXT")
    private String image;
    private Integer quantity;
    private Double freshness;
    
    @Column(name = "date_of_harvest")
    private Date dateOfHarvest;

    // Many-to-One relationship with Users (farmer who lists the product)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    @JsonIgnoreProperties({"password", "products", "orders", "feedbacks", "hibernateLazyInitializer", "handler"})
    private Users farmer;

    // One-to-Many relationship with OrderItems
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<OrderItems> orderItems;

    // One-to-Many relationship with Feedback
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Feedback> feedbacks;
}

