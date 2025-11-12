package com.harvesthub.service;

import com.harvesthub.model.Users;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public Map<String, Object> signUp(String email, String password, String name, String type, String phNo, String location) {
        Map<String, Object> response = new HashMap<>();

        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            response.put("success", false);
            response.put("message", "User with this email already exists");
            return response;
        }

        // Create new user
        Users user = new Users();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setName(name);
        user.setType(type != null ? type : "Customer");
        user.setPhNo(phNo);
        user.setLocation(location);
        user.setRegisterDate(new Date());

        Users savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getType(), savedUser.getUserId());

        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("user", Map.of(
            "userId", savedUser.getUserId(),
            "name", savedUser.getName(),
            "email", savedUser.getEmail(),
            "type", savedUser.getType()
        ));

        return response;
    }

    public Map<String, Object> signIn(String email, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<Users> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }

        Users user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "Invalid email or password");
            return response;
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getType(), user.getUserId());

        response.put("success", true);
        response.put("message", "Login successful");
        response.put("token", token);
        response.put("user", Map.of(
            "userId", user.getUserId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "type", user.getType()
        ));

        return response;
    }
}

