package com.sales.savvy.dto;

import com.sales.savvy.entity.ShippingOption;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentCreateRequest {

    @NotNull(message = "Shipping option is required")
    private ShippingOption shippingOption = ShippingOption.STANDARD;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    public PaymentCreateRequest() {
    }

    public PaymentCreateRequest(ShippingOption shippingOption, String shippingAddress) {
        this.shippingOption = shippingOption;
        this.shippingAddress = shippingAddress;
    }

    public ShippingOption getShippingOption() {
        return shippingOption;
    }

    public void setShippingOption(ShippingOption shippingOption) {
        this.shippingOption = shippingOption;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }
}
