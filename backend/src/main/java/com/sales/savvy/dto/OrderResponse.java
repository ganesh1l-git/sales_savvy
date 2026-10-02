package com.sales.savvy.dto;

import com.sales.savvy.entity.Order;
import com.sales.savvy.entity.OrderFulfillmentStatus;
import com.sales.savvy.entity.OrderItem;
import com.sales.savvy.entity.ShippingOption;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class OrderResponse {
    private Long orderId;
    private Long userId;
    private String username;
    private BigDecimal subtotal;
    private ShippingOption shippingOption;
    private BigDecimal shippingCharge;
    private BigDecimal totalAmount;
    private OrderFulfillmentStatus status;
    private String shippingAddress;
    private List<OrderItemResponse> items = new ArrayList<>();
    private PaymentResponse payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public OrderResponse() {
    }

    public OrderResponse(Order order) {
        this.orderId = order.getOrderId();
        if (order.getUser() != null) {
            this.userId = order.getUser().getUserId();
            this.username = order.getUser().getUsername();
        }
        this.subtotal = order.getSubtotal();
        this.shippingOption = order.getShippingOption();
        this.shippingCharge = order.getShippingCharge();
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus();
        this.shippingAddress = order.getShippingAddress();
        if (order.getOrderItems() != null) {
            for (OrderItem item : order.getOrderItems()) {
                this.items.add(new OrderItemResponse(item));
            }
        }
        if (order.getPayment() != null) {
            this.payment = new PaymentResponse(order.getPayment());
        }
        this.createdAt = order.getCreatedAt();
        this.updatedAt = order.getUpdatedAt();
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public ShippingOption getShippingOption() {
        return shippingOption;
    }

    public void setShippingOption(ShippingOption shippingOption) {
        this.shippingOption = shippingOption;
    }

    public BigDecimal getShippingCharge() {
        return shippingCharge;
    }

    public void setShippingCharge(BigDecimal shippingCharge) {
        this.shippingCharge = shippingCharge;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderFulfillmentStatus getStatus() {
        return status;
    }

    public void setStatus(OrderFulfillmentStatus status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }

    public PaymentResponse getPayment() {
        return payment;
    }

    public void setPayment(PaymentResponse payment) {
        this.payment = payment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
