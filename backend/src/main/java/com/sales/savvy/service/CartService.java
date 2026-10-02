package com.sales.savvy.service;

import com.sales.savvy.dto.CartItemRequest;
import com.sales.savvy.dto.CartItemResponse;
import com.sales.savvy.dto.CartResponse;
import com.sales.savvy.entity.CartItem;
import com.sales.savvy.entity.Product;
import com.sales.savvy.entity.User;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.exception.ResourceNotFoundException;
import com.sales.savvy.exception.UnauthorizedException;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       AuthService authService) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart() {
        User user = authService.getCurrentAuthenticatedUser();
        List<CartItem> items = cartItemRepository.findByUserUserId(user.getUserId());
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::new)
                .collect(Collectors.toList());
        return new CartResponse(itemResponses);
    }

    @Transactional
    public CartResponse addToCart(CartItemRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        if (request.getQuantity() <= 0) {
            throw new BadRequestException("Quantity must be greater than zero");
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserUserIdAndProductProductId(user.getUserId(), product.getProductId());

        int totalRequestedQuantity = request.getQuantity();
        CartItem cartItem;

        if (existingItemOpt.isPresent()) {
            cartItem = existingItemOpt.get();
            totalRequestedQuantity += cartItem.getQuantity();
            if (totalRequestedQuantity > product.getStock()) {
                throw new BadRequestException("Cannot add more of this item. Total in cart (" + totalRequestedQuantity +
                        ") would exceed available stock (" + product.getStock() + ")");
            }
            cartItem.setQuantity(totalRequestedQuantity);
        } else {
            if (totalRequestedQuantity > product.getStock()) {
                throw new BadRequestException("Requested quantity (" + totalRequestedQuantity +
                        ") exceeds available stock (" + product.getStock() + ")");
            }
            cartItem = new CartItem(user, product, totalRequestedQuantity);
        }

        cartItemRepository.save(cartItem);
        return getCart();
    }

    @Transactional
    public CartResponse updateItemQuantity(Long cartItemId, int newQuantity) {
        User user = authService.getCurrentAuthenticatedUser();

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("Cannot update another user's cart item");
        }

        if (newQuantity <= 0) {
            cartItemRepository.delete(item);
            return getCart();
        }

        if (newQuantity > item.getProduct().getStock()) {
            throw new BadRequestException("Requested quantity (" + newQuantity + ") exceeds available stock (" +
                    item.getProduct().getStock() + ")");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        return getCart();
    }

    @Transactional
    public CartResponse removeItem(Long cartItemId) {
        User user = authService.getCurrentAuthenticatedUser();

        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + cartItemId));

        if (!item.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("Cannot remove another user's cart item");
        }

        cartItemRepository.delete(item);
        return getCart();
    }

    @Transactional
    public void clearCart() {
        User user = authService.getCurrentAuthenticatedUser();
        cartItemRepository.deleteByUserUserId(user.getUserId());
    }

    public List<CartItem> getCartItemEntities(Long userId) {
        return cartItemRepository.findByUserUserId(userId);
    }
}
