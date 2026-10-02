package com.sales.savvy.repository;

import com.sales.savvy.entity.Order;
import com.sales.savvy.entity.OrderFulfillmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findAllByOrderByCreatedAtDesc();
    long countByStatus(OrderFulfillmentStatus status);
}
