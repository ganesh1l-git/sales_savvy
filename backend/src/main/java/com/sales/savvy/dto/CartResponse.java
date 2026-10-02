package com.sales.savvy.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class CartResponse {
    private List<CartItemResponse> items = new ArrayList<>();
    private BigDecimal subtotal = BigDecimal.ZERO;
    private int itemCount = 0;

    public CartResponse() {
    }

    public CartResponse(List<CartItemResponse> items) {
        this.items = items != null ? items : new ArrayList<>();
        this.subtotal = BigDecimal.ZERO;
        this.itemCount = 0;
        for (CartItemResponse item : this.items) {
            if (item.getSubtotal() != null) {
                this.subtotal = this.subtotal.add(item.getSubtotal());
            }
            if (item.getQuantity() != null) {
                this.itemCount += item.getQuantity();
            }
        }
    }

    public List<CartItemResponse> getItems() {
        return items;
    }

    public void setItems(List<CartItemResponse> items) {
        this.items = items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public int getItemCount() {
        return itemCount;
    }

    public void setItemCount(int itemCount) {
        this.itemCount = itemCount;
    }
}
