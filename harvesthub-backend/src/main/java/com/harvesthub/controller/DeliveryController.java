package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Delivery;
import com.harvesthub.repository.DeliveryRepository;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:3000")
public class DeliveryController {

    private final DeliveryRepository repo;

    public DeliveryController(DeliveryRepository repo) {
        this.repo = repo;
    }

    // GET all deliveries
    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return repo.findAll();
    }

    // GET delivery by ID
    @GetMapping("/{id}")
    public ResponseEntity<Delivery> getDeliveryById(@PathVariable Long id) {
        Optional<Delivery> delivery = repo.findById(id);
        return delivery.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // GET delivery by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Delivery> getDeliveryByOrderId(@PathVariable Long orderId) {
        Optional<Delivery> delivery = repo.findByOrderOrderId(orderId);
        return delivery.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // POST - Create new delivery
    @PostMapping
    public ResponseEntity<Delivery> addDelivery(@RequestBody Delivery delivery) {
        Delivery savedDelivery = repo.save(delivery);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDelivery);
    }

    // PUT - Update delivery
    @PutMapping("/{id}")
    public ResponseEntity<Delivery> updateDelivery(@PathVariable Long id, @RequestBody Delivery deliveryDetails) {
        Optional<Delivery> optionalDelivery = repo.findById(id);
        if (optionalDelivery.isPresent()) {
            Delivery delivery = optionalDelivery.get();
            delivery.setDelPerson(deliveryDetails.getDelPerson());
            delivery.setStatus(deliveryDetails.getStatus());
            delivery.setDistance(deliveryDetails.getDistance());
            delivery.setEstDelTime(deliveryDetails.getEstDelTime());
            delivery.setActualDelTime(deliveryDetails.getActualDelTime());
            delivery.setOrder(deliveryDetails.getOrder());
            Delivery updatedDelivery = repo.save(delivery);
            return ResponseEntity.ok(updatedDelivery);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete delivery
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

