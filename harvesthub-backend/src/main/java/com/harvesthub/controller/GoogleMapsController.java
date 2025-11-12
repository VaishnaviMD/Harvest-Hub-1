package com.harvesthub.controller;

import com.harvesthub.service.GoogleMapsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@CrossOrigin(origins = "*")
public class GoogleMapsController {

    @Autowired
    private GoogleMapsService googleMapsService;

    @GetMapping("/geocode")
    public ResponseEntity<Map<String, Double>> getCoordinates(@RequestParam String address) {
        Map<String, Double> coordinates = googleMapsService.getCoordinatesFromAddress(address);
        if (coordinates != null) {
            return ResponseEntity.ok(coordinates);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/distance")
    public ResponseEntity<Map<String, Object>> getDistance(
            @RequestParam double originLat,
            @RequestParam double originLng,
            @RequestParam double destLat,
            @RequestParam double destLng) {
        Map<String, Object> result = googleMapsService.calculateDistanceAndTime(
                originLat, originLng, destLat, destLng);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/route")
    public ResponseEntity<Map<String, Object>> getRoute(
            @RequestParam double originLat,
            @RequestParam double originLng,
            @RequestParam double destLat,
            @RequestParam double destLng) {
        Map<String, Object> result = googleMapsService.getRoute(
                originLat, originLng, destLat, destLng);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().build();
    }
}

