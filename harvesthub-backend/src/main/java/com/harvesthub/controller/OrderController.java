package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Date;
import java.util.ArrayList;
import java.util.Map;
import com.harvesthub.model.Orders;
import com.harvesthub.model.OrderItems;
import com.harvesthub.model.Payment;
import com.harvesthub.model.Users;
import com.harvesthub.model.Products;
import com.harvesthub.dto.CheckoutRequest;
import com.harvesthub.dto.ErrorResponse;
import com.harvesthub.repository.OrderRepository;
import com.harvesthub.repository.OrderItemRepository;
import com.harvesthub.repository.PaymentRepository;
import com.harvesthub.repository.UserRepository;
import com.harvesthub.repository.ProductRepository;
import com.harvesthub.repository.DeliveryRepository;
import com.harvesthub.model.Delivery;
import com.harvesthub.service.GoogleMapsService;
import java.util.Calendar;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;
    private final PaymentRepository paymentRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final DeliveryRepository deliveryRepo;
    private final GoogleMapsService googleMapsService;

    public OrderController(OrderRepository orderRepo, OrderItemRepository orderItemRepo,
                          PaymentRepository paymentRepo, UserRepository userRepo,
                          ProductRepository productRepo, DeliveryRepository deliveryRepo,
                          GoogleMapsService googleMapsService) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.paymentRepo = paymentRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
        this.deliveryRepo = deliveryRepo;
        this.googleMapsService = googleMapsService;
    }

    // GET all orders
    @GetMapping
    public List<Orders> getAllOrders() {
        return orderRepo.findAll();
    }

    // GET order by ID
    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrderById(@PathVariable Long id) {
        Optional<Orders> order = orderRepo.findById(id);
        return order.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    // GET orders by user ID
    @GetMapping("/user/{userId}")
    public List<Orders> getOrdersByUser(@PathVariable Long userId) {
        return orderRepo.findByUserUserId(userId);
    }

    // POST - Create new order (checkout)
    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody CheckoutRequest request) {
        try {
            // Validate request
            if (request.getItems() == null || request.getItems().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("VALIDATION_ERROR", "Order items are required"));
            }

            // Get authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            Users user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Calculate total amount
            double totalAmount = request.getItems().stream()
                .mapToDouble(item -> {
                    if (item.getPrice() == null || item.getQuantity() == null) {
                        return 0.0;
                    }
                    return item.getPrice() * item.getQuantity();
                })
                .sum();

            if (totalAmount <= 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("VALIDATION_ERROR", "Invalid order total amount"));
            }

            // Create order
            Orders order = new Orders();
            order.setUser(user);
            order.setOrderDate(new Date());
            order.setTotalAmount(totalAmount);
            Orders savedOrder = orderRepo.save(order);
            
            // Store address if provided (you might want to add address field to Orders model)
            // For now, we'll just use the address from request for delivery

            // Create order items
            List<OrderItems> orderItems = new ArrayList<>();
            for (CheckoutRequest.OrderItemRequest itemRequest : request.getItems()) {
                if (itemRequest.getProductId() == null) {
                    continue;
                }
                Optional<Products> productOpt = productRepo.findById(itemRequest.getProductId());
                if (productOpt.isPresent()) {
                    OrderItems orderItem = new OrderItems();
                    orderItem.setOrder(savedOrder);
                    orderItem.setProduct(productOpt.get());
                    orderItem.setQuantity(itemRequest.getQuantity() != null ? itemRequest.getQuantity() : 1);
                    double itemSubtotal = (itemRequest.getPrice() != null ? itemRequest.getPrice() : 0.0) * 
                                         (itemRequest.getQuantity() != null ? itemRequest.getQuantity() : 1);
                    orderItem.setSubtotal(itemSubtotal);
                    orderItems.add(orderItemRepo.save(orderItem));
                }
            }

            if (orderItems.isEmpty()) {
                // Rollback order if no items were created
                orderRepo.delete(savedOrder);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("VALIDATION_ERROR", "No valid products found in order"));
            }

            // Create payment
            Payment payment = new Payment();
            payment.setOrder(savedOrder);
            payment.setAmount(totalAmount);
            payment.setModeOfPay(request.getPaymentMethod() != null ? request.getPaymentMethod() : "cod");
            payment.setPayGateway(request.getPaymentMethod() != null && request.getPaymentMethod().equals("card") ? "Razorpay" : "COD");
            payment.setPayStatus("PENDING"); // Will be updated after payment confirmation
            payment.setPayDate(new Date());
            payment.setTransactionId("TXN" + System.currentTimeMillis());
            paymentRepo.save(payment);

            // Create delivery with GPS coordinates and route optimization
            if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
                Delivery delivery = new Delivery();
                delivery.setOrder(savedOrder);
                delivery.setStatus("PENDING");
                
                // Get coordinates for delivery address
                Map<String, Double> deliveryCoords = googleMapsService.getCoordinatesFromAddress(request.getAddress());
                if (deliveryCoords != null) {
                    delivery.setDeliveryLatitude(deliveryCoords.get("latitude"));
                    delivery.setDeliveryLongitude(deliveryCoords.get("longitude"));
                }
                
                // Get farmer coordinates (if available) or use default pickup location
                if (orderItems.size() > 0 && orderItems.get(0).getProduct().getFarmer() != null) {
                    Users farmer = orderItems.get(0).getProduct().getFarmer();
                    if (farmer.getLatitude() != null && farmer.getLongitude() != null) {
                        delivery.setPickupLatitude(farmer.getLatitude());
                        delivery.setPickupLongitude(farmer.getLongitude());
                    }
                }
                
                // Calculate distance and estimated time if both coordinates are available
                if (delivery.getPickupLatitude() != null && delivery.getDeliveryLatitude() != null) {
                    Map<String, Object> routeInfo = googleMapsService.calculateDistanceAndTime(
                        delivery.getPickupLatitude(), delivery.getPickupLongitude(),
                        delivery.getDeliveryLatitude(), delivery.getDeliveryLongitude()
                    );
                    if (routeInfo != null) {
                        delivery.setDistance((Double) routeInfo.get("distance"));
                        delivery.setEstimatedDurationMinutes((Integer) routeInfo.get("duration"));
                        
                        // Calculate estimated delivery time
                        Calendar cal = Calendar.getInstance();
                        cal.add(Calendar.MINUTE, delivery.getEstimatedDurationMinutes());
                        delivery.setEstDelTime(cal.getTime());
                    }
                }
                
                deliveryRepo.save(delivery);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("SERVER_ERROR", "Failed to create order: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName())));
        }
    }

    // PUT - Update order
    @PutMapping("/{id}")
    public ResponseEntity<Orders> updateOrder(@PathVariable Long id, @RequestBody Orders orderDetails) {
        Optional<Orders> optionalOrder = orderRepo.findById(id);
        if (optionalOrder.isPresent()) {
            Orders order = optionalOrder.get();
            order.setOrderDate(orderDetails.getOrderDate());
            order.setTotalAmount(orderDetails.getTotalAmount());
            order.setUser(orderDetails.getUser());
            Orders updatedOrder = orderRepo.save(order);
            return ResponseEntity.ok(updatedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (orderRepo.existsById(id)) {
            orderRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

