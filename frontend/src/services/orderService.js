import api from './api';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';

const ORDERS_KEY = 'sales_savvy_orders';

export const orderService = {
  getMyOrders: async () => {
    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          return data;
        }
      } catch (e) {}
    }

    // 2. Try Backend API
    try {
      const response = await api.get('/orders');
      if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (e) {}

    // 3. Fallback to localStorage
    try {
      const saved = localStorage.getItem(ORDERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (e) {
      const orders = await orderService.getMyOrders();
      const found = orders.find((o) => String(o.orderId || o.id) === String(id));
      if (found) return found;
      throw new Error('Order not found');
    }
  },
};
