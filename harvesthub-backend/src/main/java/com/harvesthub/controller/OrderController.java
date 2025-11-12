package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Orders;
import com.harvesthub.repository.OrderRepository;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderRepository repo;

    public OrderController(OrderRepository repo) {
        this.repo = repo;
    }

    // GET all orders
    @GetMapping
    public List<Orders> getAllOrders() {
        return repo.findAll();
    }

    // GET order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrderById(@PathVariable Long id) {
        Optional<Orders> order = repo.findById(id);
        return order.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // GET orders by user ID
    @GetMapping("/user/{userId}")
    public List<Orders> getOrdersByUser(@PathVariable Long userId) {
        return repo.findByUserUserId(userId);
    }

    // POST - Create new order
    @PostMapping
    public ResponseEntity<Orders> addOrder(@RequestBody Orders order) {
        Orders savedOrder = repo.save(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
    }

    // PUT - Update order
    @PutMapping("/{id}")
    public ResponseEntity<Orders> updateOrder(@PathVariable Long id, @RequestBody Orders orderDetails) {
        Optional<Orders> optionalOrder = repo.findById(id);
        if (optionalOrder.isPresent()) {
            Orders order = optionalOrder.get();
            order.setOrderDate(orderDetails.getOrderDate());
            order.setTotalAmount(orderDetails.getTotalAmount());
            order.setUser(orderDetails.getUser());
            Orders updatedOrder = repo.save(order);
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

