package com.sales.savvy;

import com.sales.savvy.dto.ProductRequest;
import com.sales.savvy.dto.ProductResponse;
import com.sales.savvy.entity.Category;
import com.sales.savvy.entity.Product;
import com.sales.savvy.repository.CategoryRepository;
import com.sales.savvy.repository.ProductImageRepository;
import com.sales.savvy.repository.ProductRepository;
import com.sales.savvy.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    private ProductService productService;

    @BeforeEach
    void setUp() {
        productService = new ProductService(productRepository, categoryRepository, productImageRepository);
    }

    @Test
    void testCreateProduct() {
        Category category = new Category("Electronics");
        category.setCategoryId(1L);

        ProductRequest request = new ProductRequest(
                "Phone",
                "Smartphone",
                new BigDecimal("500.00"),
                10,
                1L,
                List.of("https://example.com/img1.jpg")
        );

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product p = invocation.getArgument(0);
            p.setProductId(100L);
            return p;
        });

        ProductResponse response = productService.createProduct(request);

        assertNotNull(response);
        assertEquals("Phone", response.getName());
        assertEquals(new BigDecimal("500.00"), response.getPrice());
        assertEquals("Electronics", response.getCategoryName());
    }

    @Test
    void testReduceStock() {
        Product product = new Product("Item", "Desc", new BigDecimal("50.00"), 20, null);
        product.setProductId(1L);

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.reduceStock(1L, 5);

        assertEquals(15, product.getStock());
        verify(productRepository, times(1)).save(product);
    }
}
