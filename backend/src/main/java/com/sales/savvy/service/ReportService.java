package com.sales.savvy.service;

import com.sales.savvy.dto.ReportResponse;
import com.sales.savvy.entity.OrderFulfillmentStatus;
import com.sales.savvy.entity.PaymentStatus;
import com.sales.savvy.repository.OrderRepository;
import com.sales.savvy.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class ReportService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    public ReportService(OrderRepository orderRepository, PaymentRepository paymentRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
    }

    public ReportResponse getSalesReport() {
        long totalOrders = orderRepository.count();
        long successfulOrders = paymentRepository.countByStatus(PaymentStatus.SUCCESS);
        long failedOrders = paymentRepository.countByStatus(PaymentStatus.FAILED);
        BigDecimal totalSales = paymentRepository.sumTotalSuccessfulSales();

        long pendingOrders = orderRepository.countByStatus(OrderFulfillmentStatus.PENDING);
        long approvedOrders = orderRepository.countByStatus(OrderFulfillmentStatus.APPROVED);
        long shippedOrders = orderRepository.countByStatus(OrderFulfillmentStatus.SHIPPED);
        long deliveredOrders = orderRepository.countByStatus(OrderFulfillmentStatus.DELIVERED);
        long cancelledOrders = orderRepository.countByStatus(OrderFulfillmentStatus.CANCELLED);

        return new ReportResponse(
                totalOrders,
                successfulOrders,
                failedOrders,
                totalSales != null ? totalSales : BigDecimal.ZERO,
                pendingOrders,
                approvedOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders
        );
    }
}
