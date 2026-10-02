package com.sales.savvy.dto;

import com.sales.savvy.entity.OrderFulfillmentStatus;
import jakarta.validation.constraints.NotNull;

public class OrderStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private OrderFulfillmentStatus status;

    public OrderStatusUpdateRequest() {
    }

    public OrderStatusUpdateRequest(OrderFulfillmentStatus status) {
        this.status = status;
    }

    public OrderFulfillmentStatus getStatus() {
        return status;
    }

    public void setStatus(OrderFulfillmentStatus status) {
        this.status = status;
    }
}
