package com.sales.savvy.repository;

import com.sales.savvy.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserUserId(Long userId);
    Optional<CartItem> findByUserUserIdAndProductProductId(Long userId, Long productId);
    void deleteByUserUserId(Long userId);
    long countByUserUserId(Long userId);
}
