package com.sales.savvy;

import com.sales.savvy.dto.CartItemRequest;
import com.sales.savvy.dto.CartResponse;
import com.sales.savvy.entity.CartItem;
import com.sales.savvy.entity.Product;
import com.sales.savvy.entity.Role;
import com.sales.savvy.entity.User;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.ProductRepository;
import com.sales.savvy.service.AuthService;
import com.sales.savvy.service.CartService;
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
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private AuthService authService;

    private CartService cartService;
    private User testUser;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        cartService = new CartService(cartItemRepository, productRepository, authService);

        testUser = new User("cartuser", "cart@example.com", "pass", Role.CUSTOMER);
        testUser.setUserId(1L);

        testProduct = new Product("Test Product", "Description", new BigDecimal("100.00"), 10, null);
        testProduct.setProductId(5L);
    }

    @Test
    void testAddToCartSuccess() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(testUser);
        when(productRepository.findById(5L)).thenReturn(Optional.of(testProduct));
        when(cartItemRepository.findByUserUserIdAndProductProductId(1L, 5L)).thenReturn(Optional.empty());

        CartItem item = new CartItem(testUser, testProduct, 2);
        when(cartItemRepository.findByUserUserId(1L)).thenReturn(List.of(item));

        CartResponse response = cartService.addToCart(new CartItemRequest(5L, 2));

        assertNotNull(response);
        assertEquals(1, response.getItems().size());
        assertEquals(2, response.getItemCount());
        assertEquals(new BigDecimal("200.00"), response.getSubtotal());
        verify(cartItemRepository, times(1)).save(any(CartItem.class));
    }

    @Test
    void testAddToCartExceedsStockThrowsException() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(testUser);
        when(productRepository.findById(5L)).thenReturn(Optional.of(testProduct));

        CartItemRequest request = new CartItemRequest(5L, 15); // stock is 10

        assertThrows(BadRequestException.class, () -> cartService.addToCart(request));
        verify(cartItemRepository, never()).save(any());
    }
}
