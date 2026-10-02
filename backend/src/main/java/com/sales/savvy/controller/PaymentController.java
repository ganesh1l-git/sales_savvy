package com.sales.savvy.controller;

import com.sales.savvy.dto.PaymentCreateRequest;
import com.sales.savvy.dto.PaymentCreateResponse;
import com.sales.savvy.dto.PaymentResponse;
import com.sales.savvy.dto.PaymentVerifyRequest;
import com.sales.savvy.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<PaymentCreateResponse> createPaymentOrder(@Valid @RequestBody PaymentCreateRequest request) {
        PaymentCreateResponse response = paymentService.createPaymentOrder(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponse> verifyPayment(@Valid @RequestBody PaymentVerifyRequest request) {
        PaymentResponse response = paymentService.verifyPayment(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getMyPayments() {
        return ResponseEntity.ok(paymentService.getPaymentsForCurrentUser());
    }
}
