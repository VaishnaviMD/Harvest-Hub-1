package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import com.harvesthub.model.Payment;
import com.harvesthub.repository.PaymentRepository;
import com.harvesthub.service.PaymentGatewayService;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentRepository repo;
    private final PaymentGatewayService paymentGatewayService;

    public PaymentController(PaymentRepository repo, PaymentGatewayService paymentGatewayService) {
        this.repo = repo;
        this.paymentGatewayService = paymentGatewayService;
    }

    // GET all payments
    @GetMapping
    public List<Payment> getAllPayments() {
        return repo.findAll();
    }

    // GET payment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = repo.findById(id);
        return payment.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // GET payment by order ID
    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Optional<Payment> payment = repo.findByOrderOrderId(orderId);
        return payment.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    // POST - Create new payment
    @PostMapping
    public ResponseEntity<Payment> addPayment(@RequestBody Payment payment) {
        Payment savedPayment = repo.save(payment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPayment);
    }

    // POST - Update payment status after gateway confirmation
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long id, @RequestBody Map<String, String> paymentData) {
        Optional<Payment> paymentOpt = repo.findById(id);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setPayStatus(paymentData.get("status"));
            payment.setTransactionId(paymentData.get("transactionId"));
            Payment updatedPayment = repo.save(payment);
            return ResponseEntity.ok(updatedPayment);
        }
        return ResponseEntity.notFound().build();
    }

    // PUT - Update payment
    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(@PathVariable Long id, @RequestBody Payment paymentDetails) {
        Optional<Payment> optionalPayment = repo.findById(id);
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            payment.setPayGateway(paymentDetails.getPayGateway());
            payment.setModeOfPay(paymentDetails.getModeOfPay());
            payment.setTransactionId(paymentDetails.getTransactionId());
            payment.setAmount(paymentDetails.getAmount());
            payment.setPayStatus(paymentDetails.getPayStatus());
            payment.setPayDate(paymentDetails.getPayDate());
            payment.setOrder(paymentDetails.getOrder());
            Payment updatedPayment = repo.save(payment);
            return ResponseEntity.ok(updatedPayment);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete payment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

