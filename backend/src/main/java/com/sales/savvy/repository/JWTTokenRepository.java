package com.sales.savvy.repository;

import com.sales.savvy.entity.JWTToken;
import com.sales.savvy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JWTTokenRepository extends JpaRepository<JWTToken, Long> {
    Optional<JWTToken> findByToken(String token);
    List<JWTToken> findAllByUserAndRevokedFalse(User user);
    void deleteByUser(User user);
    void deleteAllByExpiresAtBefore(LocalDateTime now);
}
