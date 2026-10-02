package com.sales.savvy.service;

import com.sales.savvy.dto.OrderResponse;
import com.sales.savvy.dto.OrderStatusUpdateRequest;
import com.sales.savvy.entity.*;
import com.sales.savvy.exception.BadRequestException;
import com.sales.savvy.exception.ResourceNotFoundException;
import com.sales.savvy.exception.UnauthorizedException;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.OrderItemRepository;
import com.sales.savvy.repository.OrderRepository;
import com.sales.savvy.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    @Value("${shipping.rate.standard:50.00}")
    private BigDecimal standardShippingRate;

    @Value("${shipping.rate.express:120.00}")
    private BigDecimal expressShippingRate;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        AuthService authService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.authService = authService;
    }

    public BigDecimal calculateShippingRate(ShippingOption option) {
        if (option == ShippingOption.EXPRESS) {
            return expressShippingRate;
        }
        return standardShippingRate;
    }

    @Transactional
    public Order createInternalOrder(User user, ShippingOption shippingOption, String shippingAddress) {
        List<CartItem> cartItems = cartItemRepository.findByUserUserId(user.getUserId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty. Cannot checkout.");
        }

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new BadRequestException("Product '" + product.getName() + "' has insufficient stock (" +
                        product.getStock() + " available, requested " + item.getQuantity() + ")");
            }
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal shippingCharge = calculateShippingRate(shippingOption);
        BigDecimal totalAmount = subtotal.add(shippingCharge);

        Order order = new Order(user, subtotal, shippingOption, shippingCharge, totalAmount, shippingAddress);
        order.setStatus(OrderFulfillmentStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

        for (CartItem item : cartItems) {
            OrderItem orderItem = new OrderItem(
                    savedOrder,
                    item.getProduct(),
                    item.getQuantity(),
                    item.getProduct().getPrice()
            );
            savedOrder.addOrderItem(orderItem);
            orderItemRepository.save(orderItem);
        }

        return savedOrder;
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersForCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        List<Order> orders = orderRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId());
        return orders.stream().map(OrderResponse::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId) {
        User user = authService.getCurrentAuthenticatedUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (user.getRole() != Role.ADMIN && !order.getUser().getUserId().equals(user.getUserId())) {
            throw new UnauthorizedException("Cannot view orders belonging to another user");
        }

        return new OrderResponse(order);
    }

    @Transactional(readOnly = true)
    public Order getOrderEntity(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatusAdmin(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderFulfillmentStatus oldStatus = order.getStatus();
        OrderFulfillmentStatus newStatus = request.getStatus();

        // If order was cancelled and was previously approved/shipped, restore stock
        if (newStatus == OrderFulfillmentStatus.CANCELLED && oldStatus != OrderFulfillmentStatus.CANCELLED && oldStatus != OrderFulfillmentStatus.PENDING) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        return new OrderResponse(saved);
    }
}
