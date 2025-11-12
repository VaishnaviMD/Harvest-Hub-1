package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.OrderItems;
import com.harvesthub.repository.OrderItemRepository;

@RestController
@RequestMapping("/api/order-items")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderItemController {

    private final OrderItemRepository repo;

    public OrderItemController(OrderItemRepository repo) {
        this.repo = repo;
    }

    // GET all order items
    @GetMapping
    public List<OrderItems> getAllOrderItems() {
        return repo.findAll();
    }

    // GET order item by ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderItems> getOrderItemById(@PathVariable Long id) {
        Optional<OrderItems> orderItem = repo.findById(id);
        return orderItem.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    // GET order items by order ID
    @GetMapping("/order/{orderId}")
    public List<OrderItems> getOrderItemsByOrder(@PathVariable Long orderId) {
        return repo.findByOrderOrderId(orderId);
    }

    // POST - Create new order item
    @PostMapping
    public ResponseEntity<OrderItems> addOrderItem(@RequestBody OrderItems orderItem) {
        OrderItems savedOrderItem = repo.save(orderItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrderItem);
    }

    // PUT - Update order item
    @PutMapping("/{id}")
    public ResponseEntity<OrderItems> updateOrderItem(@PathVariable Long id, @RequestBody OrderItems orderItemDetails) {
        Optional<OrderItems> optionalOrderItem = repo.findById(id);
        if (optionalOrderItem.isPresent()) {
            OrderItems orderItem = optionalOrderItem.get();
            orderItem.setQuantity(orderItemDetails.getQuantity());
            orderItem.setSubtotal(orderItemDetails.getSubtotal());
            orderItem.setOrder(orderItemDetails.getOrder());
            orderItem.setProduct(orderItemDetails.getProduct());
            OrderItems updatedOrderItem = repo.save(orderItem);
            return ResponseEntity.ok(updatedOrderItem);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete order item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

