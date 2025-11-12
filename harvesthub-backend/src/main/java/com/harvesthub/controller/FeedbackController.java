package com.harvesthub.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import com.harvesthub.model.Feedback;
import com.harvesthub.repository.FeedbackRepository;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    private final FeedbackRepository repo;

    public FeedbackController(FeedbackRepository repo) {
        this.repo = repo;
    }

    // GET all feedback
    @GetMapping
    public List<Feedback> getAllFeedback() {
        return repo.findAll();
    }

    // GET feedback by ID
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        Optional<Feedback> feedback = repo.findById(id);
        return feedback.map(ResponseEntity::ok)
                       .orElse(ResponseEntity.notFound().build());
    }

    // GET feedback by product ID
    @GetMapping("/product/{productId}")
    public List<Feedback> getFeedbackByProduct(@PathVariable Long productId) {
        return repo.findByProductProductId(productId);
    }

    // GET feedback by user ID
    @GetMapping("/user/{userId}")
    public List<Feedback> getFeedbackByUser(@PathVariable Long userId) {
        return repo.findByUserUserId(userId);
    }

    // POST - Create new feedback
    @PostMapping
    public ResponseEntity<Feedback> addFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = repo.save(feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
    }

    // PUT - Update feedback
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable Long id, @RequestBody Feedback feedbackDetails) {
        Optional<Feedback> optionalFeedback = repo.findById(id);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            feedback.setComment(feedbackDetails.getComment());
            feedback.setRating(feedbackDetails.getRating());
            feedback.setDateOfFeedback(feedbackDetails.getDateOfFeedback());
            feedback.setUser(feedbackDetails.getUser());
            feedback.setProduct(feedbackDetails.getProduct());
            Feedback updatedFeedback = repo.save(feedback);
            return ResponseEntity.ok(updatedFeedback);
        }
        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete feedback
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

