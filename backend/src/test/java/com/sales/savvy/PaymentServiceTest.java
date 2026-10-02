package com.sales.savvy;

import com.sales.savvy.dto.PaymentResponse;
import com.sales.savvy.dto.PaymentVerifyRequest;
import com.sales.savvy.entity.*;
import com.sales.savvy.repository.CartItemRepository;
import com.sales.savvy.repository.OrderRepository;
import com.sales.savvy.repository.PaymentRepository;
import com.sales.savvy.repository.ProductRepository;
import com.sales.savvy.service.AuthService;
import com.sales.savvy.service.OrderService;
import com.sales.savvy.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderService orderService;

    @Mock
    private AuthService authService;

    private PaymentService paymentService;
    private User testUser;
    private Order testOrder;
    private Payment testPayment;
    private Product testProduct;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService(
                paymentRepository,
                orderRepository,
                cartItemRepository,
                productRepository,
                orderService,
                authService
        );

        ReflectionTestUtils.setField(paymentService, "razorpayKeySecret", "testsecret");

        testUser = new User("payuser", "pay@example.com", "pass", Role.CUSTOMER);
        testUser.setUserId(2L);

        testOrder = new Order(testUser, new BigDecimal("100.00"), ShippingOption.STANDARD, new BigDecimal("50.00"), new BigDecimal("150.00"), "123 Test Street");
        testOrder.setOrderId(10L);

        testProduct = new Product("Widget", "A widget", new BigDecimal("100.00"), 10, null);
        testProduct.setProductId(1L);

        OrderItem orderItem = new OrderItem(testOrder, testProduct, 1, new BigDecimal("100.00"));
        testOrder.addOrderItem(orderItem);

        testPayment = new Payment(testOrder, testUser, "order_mock_12345", new BigDecimal("150.00"), "INR");
        testPayment.setPaymentId(20L);
    }

    @Test
    void testVerifyPaymentMockSuccess() {
        when(authService.getCurrentAuthenticatedUser()).thenReturn(testUser);
        when(orderRepository.findById(10L)).thenReturn(Optional.of(testOrder));
        when(paymentRepository.findByOrderOrderId(10L)).thenReturn(Optional.of(testPayment));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PaymentVerifyRequest request = new PaymentVerifyRequest(
                10L,
                "order_mock_12345",
                "pay_mock_99999",
                "mock_signature"
        );

        PaymentResponse response = paymentService.verifyPayment(request);

        assertNotNull(response);
        assertEquals(PaymentStatus.SUCCESS, response.getStatus());
        assertEquals(OrderFulfillmentStatus.APPROVED, testOrder.getStatus());
        assertEquals(9, testProduct.getStock()); // Reduced by 1
        verify(cartItemRepository, times(1)).deleteByUserUserId(2L); // Cart cleared
    }
}
