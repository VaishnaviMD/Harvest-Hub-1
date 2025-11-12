package com.harvesthub.repository;

import com.harvesthub.model.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItems, Long> {
    List<OrderItems> findByOrderOrderId(Long orderId);
}

