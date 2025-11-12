package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Products;
import com.harvesthub.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    // GET all products
    @GetMapping
    public List<Products> getAllProducts() {
        return repo.findAll();
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
    public List<Products> getProductsByFarmer(@PathVariable Long farmerId) {
        return repo.findByFarmerUserId(farmerId);
    }

    // POST - Create new product
    @PostMapping
    public ResponseEntity<Products> addProduct(@RequestBody Products product) {
        Products savedProduct = repo.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
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
            product.setFarmer(productDetails.getFarmer());
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

