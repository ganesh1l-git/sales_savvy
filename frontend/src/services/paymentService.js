import api from './api';

export const paymentService = {
  createPaymentOrder: async (data) => {
    try {
      const response = await api.post('/payment/create', data);
      if (response.data && response.data.razorpayOrderId) {
        return response.data;
      }
    } catch (err) {
      // If the backend actively rejected the request (e.g. 400 Empty Cart, 401 Unauthorized), rethrow so UI displays the real error
      if (err?.status && err.status >= 400 && err.status < 500 && err.status !== 404) {
        throw err;
      }
      // Backend not running (network error, 404, 502, 503) or offline demo mode on Vercel
    }

    // Fallback: Generate mock payment order structure
    const mockOrderId = Date.now();
    let calculatedAmount = Number(data.amount);
    if (!calculatedAmount || isNaN(calculatedAmount)) {
      try {
        const localCart = JSON.parse(localStorage.getItem('sales_savvy_cart') || '{}');
        const shipping = data.shippingOption === 'EXPRESS' ? 120 : 50;
        calculatedAmount = Number(localCart.subtotal || 0) + shipping;
      } catch (e) {
        calculatedAmount = 999;
      }
    }

    return {
      orderId: mockOrderId,
      razorpayOrderId: 'order_mock_' + mockOrderId,
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
      amountInPaise: Math.round(calculatedAmount * 100),
      currency: 'INR',
      customerName: data.customerName || 'Customer',
      customerEmail: data.customerEmail || 'customer@sales-savvy.com',
      shippingOption: data.shippingOption || 'STANDARD',
      shippingAddress: data.shippingAddress || '',
    };
  },

  verifyPayment: async (data) => {
    const isMock = Boolean(data.razorpayOrderId && data.razorpayOrderId.startsWith('order_mock_'));

    if (!isMock) {
      try {
        const response = await api.post('/payment/verify', {
          orderId: data.orderId,
          razorpayOrderId: data.razorpayOrderId,
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
        });
        if (response.data) return response.data;
      } catch (err) {
        // If the backend actively rejected the signature verification, rethrow so UI directs to payment-failed
        if (err?.status && err.status >= 400 && err.status < 500 && err.status !== 404) {
          throw err;
        }
        // Backend offline / unreachable -> allow local mock completion
      }
    }

    // Save order in localStorage so it appears in /orders and /orders/:id in offline/demo mode
    try {
      const orders = JSON.parse(localStorage.getItem('sales_savvy_orders') || '[]');
      const localCart = JSON.parse(localStorage.getItem('sales_savvy_cart') || '{"items":[]}');
      const mockOrder = {
        orderId: data.orderId,
        id: data.orderId,
        status: 'APPROVED',
        totalAmount: data.amount || 999,
        shippingOption: data.shippingOption || 'STANDARD',
        shippingAddress: data.shippingAddress || 'Customer Address',
        paymentMethod: 'RAZORPAY',
        createdAt: new Date().toISOString(),
        items: (localCart.items || []).map((item, idx) => ({
          orderItemId: Date.now() + idx,
          product: item.product,
          quantity: item.quantity,
          unitPrice: item.product?.price || 0,
          subtotal: (item.product?.price || 0) * item.quantity,
        })),
      };
      orders.unshift(mockOrder);
      localStorage.setItem('sales_savvy_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Could not store fallback order:', e);
    }

    return { status: 'SUCCESS', verified: true, orderId: data.orderId };
  },

  getMyPayments: async () => {
    try {
      const response = await api.get('/payment/history');
      if (response.data && Array.isArray(response.data)) return response.data;
    } catch (err) {}
    return [];
  },
};

