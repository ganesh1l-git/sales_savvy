import api from './api';

export const paymentService = {
  createPaymentOrder: async (data) => {
    const response = await api.post('/payment/create', data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await api.post('/payment/verify', data);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  }
};
