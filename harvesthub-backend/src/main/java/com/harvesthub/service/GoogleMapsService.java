package com.harvesthub.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class GoogleMapsService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    @Value("${google.maps.geocoding.url}")
    private String geocodingUrl;

    @Value("${google.maps.distancematrix.url}")
    private String distanceMatrixUrl;

    @Value("${google.maps.directions.url}")
    private String directionsUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GoogleMapsService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Get GPS coordinates from address using Geocoding API
     */
    public Map<String, Double> getCoordinatesFromAddress(String address) {
        try {
            String url = geocodingUrl + "?address=" + java.net.URLEncoder.encode(address, "UTF-8") + "&key=" + apiKey;
            
            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            if (jsonNode.has("results") && jsonNode.get("results").size() > 0) {
                JsonNode location = jsonNode.get("results").get(0).get("geometry").get("location");
                Map<String, Double> coordinates = new HashMap<>();
                coordinates.put("latitude", location.get("lat").asDouble());
                coordinates.put("longitude", location.get("lng").asDouble());
                return coordinates;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Calculate distance and estimated time between two coordinates
     */
    public Map<String, Object> calculateDistanceAndTime(double originLat, double originLng, 
                                                         double destLat, double destLng) {
        try {
            String origins = originLat + "," + originLng;
            String destinations = destLat + "," + destLng;
            String url = distanceMatrixUrl + "?origins=" + origins + "&destinations=" + destinations 
                    + "&key=" + apiKey + "&units=metric";

            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            if (jsonNode.has("rows") && jsonNode.get("rows").size() > 0) {
                JsonNode element = jsonNode.get("rows").get(0).get("elements").get(0);
                if (element.get("status").asText().equals("OK")) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("distance", element.get("distance").get("value").asDouble() / 1000.0); // Convert to km
                    result.put("duration", element.get("duration").get("value").asInt() / 60); // Convert to minutes
                    result.put("distanceText", element.get("distance").get("text").asText());
                    result.put("durationText", element.get("duration").get("text").asText());
                    return result;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Get optimized route between two points
     */
    public Map<String, Object> getRoute(double originLat, double originLng, 
                                         double destLat, double destLng) {
        try {
            String origin = originLat + "," + originLng;
            String destination = destLat + "," + destLng;
            String url = directionsUrl + "?origin=" + origin + "&destination=" + destination 
                    + "&key=" + apiKey;

            String response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            if (jsonNode.has("routes") && jsonNode.get("routes").size() > 0) {
                JsonNode route = jsonNode.get("routes").get(0);
                JsonNode leg = route.get("legs").get(0);
                
                Map<String, Object> result = new HashMap<>();
                result.put("distance", leg.get("distance").get("value").asDouble() / 1000.0);
                result.put("duration", leg.get("duration").get("value").asInt() / 60);
                result.put("distanceText", leg.get("distance").get("text").asText());
                result.put("durationText", leg.get("duration").get("text").asText());
                
                // Get polyline for route visualization
                if (route.has("overview_polyline")) {
                    result.put("polyline", route.get("overview_polyline").get("points").asText());
                }
                
                // Get steps for turn-by-turn directions
                if (leg.has("steps")) {
                    result.put("steps", leg.get("steps"));
                }
                
                return result;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

