package com.sales.savvy.controller;

import com.sales.savvy.dto.OrderResponse;
import com.sales.savvy.dto.OrderStatusUpdateRequest;
import com.sales.savvy.dto.PaymentResponse;
import com.sales.savvy.dto.ReportResponse;
import com.sales.savvy.dto.UserResponse;
import com.sales.savvy.dto.UserUpdateRequest;
import com.sales.savvy.service.OrderService;
import com.sales.savvy.service.PaymentService;
import com.sales.savvy.service.ReportService;
import com.sales.savvy.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final OrderService orderService;
    private final PaymentService paymentService;
    private final ReportService reportService;

    public AdminController(UserService userService,
                           OrderService orderService,
                           PaymentService paymentService,
                           ReportService reportService) {
        this.userService = userService;
        this.orderService = orderService;
        this.paymentService = paymentService;
        this.reportService = reportService;
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUserByAdmin(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUserByAdmin(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrdersAdmin());
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatusAdmin(id, request));
    }

    // Payment Records
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPaymentsAdmin());
    }

    // Sales Reports
    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> getSalesReport() {
        return ResponseEntity.ok(reportService.getSalesReport());
    }
}
