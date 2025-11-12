package com.harvesthub.repository;

import com.harvesthub.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByProductProductId(Long productId);
    List<Feedback> findByUserUserId(Long userId);
}

