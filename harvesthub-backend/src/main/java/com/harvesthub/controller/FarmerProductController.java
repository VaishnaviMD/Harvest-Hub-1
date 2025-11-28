package com.harvesthub.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.harvesthub.model.Products;
import com.harvesthub.model.Users;
import com.harvesthub.repository.ProductRepository;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.util.JwtUtil;

@RestController
@RequestMapping("/api/farmer/products")
@CrossOrigin(origins = "*")
public class FarmerProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public FarmerProductController(ProductRepository productRepository, UserRepository userRepository, JwtUtil jwtUtil) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ResponseEntity<List<Products>> getMyProducts(@RequestHeader("Authorization") String authHeader) {
        Users farmer = resolveAuthenticatedFarmer(authHeader);
        List<Products> products = productRepository.findByFarmerUserId(farmer.getUserId());
        products.forEach(product -> {
            if (product.getFarmer() != null) {
                product.getFarmer().getUserId();
            }
        });
        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Products> createProduct(@RequestHeader("Authorization") String authHeader,
                                                  @RequestBody Products productRequest) {
        try {
            Users farmer = resolveAuthenticatedFarmer(authHeader);
            Products product = prepareProductForSave(productRequest, farmer);
            Products saved = productRepository.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to create product: " + e.getMessage());
        }
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Products> updateProduct(@RequestHeader("Authorization") String authHeader,
                                                  @PathVariable Long productId,
                                                  @RequestBody Products productRequest) {
        try {
            Users farmer = resolveAuthenticatedFarmer(authHeader);
            Products existing = productRepository.findByProductIdAndFarmerUserId(productId, farmer.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            existing.setName(productRequest.getName());
            existing.setCategory(productRequest.getCategory());
            existing.setPrice(productRequest.getPrice());
            existing.setQuantity(productRequest.getQuantity());
            existing.setImage(productRequest.getImage());
            existing.setFreshness(productRequest.getFreshness());
            existing.setDateOfHarvest(productRequest.getDateOfHarvest());

            Products updated = productRepository.save(existing);
            return ResponseEntity.ok(updated);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update product: " + e.getMessage());
        }
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@RequestHeader("Authorization") String authHeader,
                                              @PathVariable Long productId) {
        try {
            Users farmer = resolveAuthenticatedFarmer(authHeader);
            Products existing = productRepository.findByProductIdAndFarmerUserId(productId, farmer.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            productRepository.delete(existing);
            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to delete product: " + e.getMessage());
        }
    }

    private Users resolveAuthenticatedFarmer(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid authorization header");
        }

        String token = authHeader.substring(7);
        Long userId = jwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }

        Users user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        if (!"farmer".equalsIgnoreCase(user.getType())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only farmers can manage products");
        }

        return user;
    }

    private Products prepareProductForSave(Products incoming, Users farmer) {
        Products product = incoming;
        product.setProductId(null);
        product.setFarmer(farmer);
        return product;
    }
}

