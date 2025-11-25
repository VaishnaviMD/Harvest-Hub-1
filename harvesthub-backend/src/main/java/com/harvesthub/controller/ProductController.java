package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Products;
import com.harvesthub.model.Users;
import com.harvesthub.repository.ProductRepository;
import com.harvesthub.repository.UserRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repo;
    private final UserRepository userRepository;

    public ProductController(ProductRepository repo, UserRepository userRepository) {
        this.repo = repo;
        this.userRepository = userRepository;
    }

    // GET all products
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Products>> getAllProducts() {
        try {
            List<Products> products = repo.findAll();
            // Initialize farmer relationship to avoid lazy loading issues
            products.forEach(p -> {
                if (p.getFarmer() != null) {
                    p.getFarmer().getUserId(); // Trigger lazy loading
                }
            });
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable Long id) {
        Optional<Products> product = repo.findById(id);
        return product.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // GET products by category
    @GetMapping("/category/{category}")
    public List<Products> getProductsByCategory(@PathVariable String category) {
        return repo.findByCategory(category);
    }

    // GET products by farmer ID
    @GetMapping("/farmer/{farmerId}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Products>> getProductsByFarmer(@PathVariable Long farmerId) {
        try {
            List<Products> products = repo.findByFarmerUserId(farmerId);
            // Initialize farmer relationship to avoid lazy loading issues
            products.forEach(p -> {
                if (p.getFarmer() != null) {
                    p.getFarmer().getUserId(); // Trigger lazy loading
                }
            });
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // POST - Create new product
    @PostMapping
    @Transactional
    public ResponseEntity<Products> addProduct(@RequestBody Products product) {
        try {
            // If farmer is provided with userId, fetch the full User entity
            if (product.getFarmer() != null && product.getFarmer().getUserId() != null) {
                Optional<Users> farmerOpt = userRepository.findById(product.getFarmer().getUserId());
                if (farmerOpt.isPresent()) {
                    product.setFarmer(farmerOpt.get());
                } else {
                    return ResponseEntity.badRequest().body(null);
                }
            }
            Products savedProduct = repo.save(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT - Update product
    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduct(@PathVariable Long id, @RequestBody Products productDetails) {
        Optional<Products> optionalProduct = repo.findById(id);
        if (optionalProduct.isPresent()) {
            Products product = optionalProduct.get();
            product.setName(productDetails.getName());
            product.setCategory(productDetails.getCategory());
            product.setPrice(productDetails.getPrice());
            product.setImage(productDetails.getImage());
            product.setQuantity(productDetails.getQuantity());
            product.setFreshness(productDetails.getFreshness());
            product.setDateOfHarvest(productDetails.getDateOfHarvest());
            
            // Handle farmer relationship update
            if (productDetails.getFarmer() != null && productDetails.getFarmer().getUserId() != null) {
                Optional<Users> farmerOpt = userRepository.findById(productDetails.getFarmer().getUserId());
                if (farmerOpt.isPresent()) {
                    product.setFarmer(farmerOpt.get());
                }
            }
            
            Products updatedProduct = repo.save(product);
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

