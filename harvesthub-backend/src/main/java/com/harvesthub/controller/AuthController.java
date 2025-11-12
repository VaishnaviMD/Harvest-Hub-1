package com.harvesthub.controller;

import com.harvesthub.dto.SignInRequest;
import com.harvesthub.dto.SignUpRequest;
import com.harvesthub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signUp(@RequestBody SignUpRequest request) {
        Map<String, Object> result = authService.signUp(
            request.getEmail(),
            request.getPassword(),
            request.getName(),
            request.getType(),
            request.getPhNo(),
            request.getLocation()
        );

        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signIn(@RequestBody SignInRequest request) {
        Map<String, Object> result = authService.signIn(request.getEmail(), request.getPassword());

        if ((Boolean) result.get("success")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}

