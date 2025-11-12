package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Users;
import com.harvesthub.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    // GET all users
    @GetMapping
    public List<Users> getAllUsers() {
        return repo.findAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Optional<Users> user = repo.findById(id);
        return user.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // POST - Create new user
    @PostMapping
    public ResponseEntity<Users> addUser(@RequestBody Users user) {
        Users savedUser = repo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // PUT - Update user
    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users userDetails) {
        Optional<Users> optionalUser = repo.findById(id);
        if (optionalUser.isPresent()) {
            Users user = optionalUser.get();
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(userDetails.getPassword());
            user.setPhNo(userDetails.getPhNo());
            user.setLocation(userDetails.getLocation());
            user.setType(userDetails.getType());
            user.setRegisterDate(userDetails.getRegisterDate());
            Users updatedUser = repo.save(user);
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

