package com.sales.savvy.dto;

import java.math.BigDecimal;

public class ReportResponse {
    private long totalOrders;
    private long successfulOrders;
    private long failedOrders;
    private BigDecimal totalSales;
    private long pendingOrders;
    private long approvedOrders;
    private long shippedOrders;
    private long deliveredOrders;
    private long cancelledOrders;

    public ReportResponse() {
        this.totalSales = BigDecimal.ZERO;
    }

    public ReportResponse(long totalOrders, long successfulOrders, long failedOrders, BigDecimal totalSales,
                          long pendingOrders, long approvedOrders, long shippedOrders, long deliveredOrders, long cancelledOrders) {
        this.totalOrders = totalOrders;
        this.successfulOrders = successfulOrders;
        this.failedOrders = failedOrders;
        this.totalSales = totalSales != null ? totalSales : BigDecimal.ZERO;
        this.pendingOrders = pendingOrders;
        this.approvedOrders = approvedOrders;
        this.shippedOrders = shippedOrders;
        this.deliveredOrders = deliveredOrders;
        this.cancelledOrders = cancelledOrders;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getSuccessfulOrders() {
        return successfulOrders;
    }

    public void setSuccessfulOrders(long successfulOrders) {
        this.successfulOrders = successfulOrders;
    }

    public long getFailedOrders() {
        return failedOrders;
    }

    public void setFailedOrders(long failedOrders) {
        this.failedOrders = failedOrders;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getApprovedOrders() {
        return approvedOrders;
    }

    public void setApprovedOrders(long approvedOrders) {
        this.approvedOrders = approvedOrders;
    }

    public long getShippedOrders() {
        return shippedOrders;
    }

    public void setShippedOrders(long shippedOrders) {
        this.shippedOrders = shippedOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }
}
