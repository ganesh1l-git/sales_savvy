package com.sales.savvy.repository;

import com.sales.savvy.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Product> findByCategoryCategoryIdAndNameContainingIgnoreCase(Long categoryId, String name, Pageable pageable);

    Page<Product> findBySubCategoryIgnoreCase(String subCategory, Pageable pageable);
    Page<Product> findByCategoryCategoryIdAndSubCategoryIgnoreCase(Long categoryId, String subCategory, Pageable pageable);
    Page<Product> findByCategoryCategoryIdAndSubCategoryIgnoreCaseAndNameContainingIgnoreCase(Long categoryId, String subCategory, String name, Pageable pageable);
    Page<Product> findBySubCategoryIgnoreCaseAndNameContainingIgnoreCase(String subCategory, String name, Pageable pageable);

    List<Product> findByCategoryCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.images WHERE p.productId = :id")
    Product findByIdWithImages(@Param("id") Long id);
}
