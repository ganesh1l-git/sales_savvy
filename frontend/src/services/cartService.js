import api from './api';
import { DEFAULT_PRODUCTS } from '../data/productCatalog';

const CART_KEY = 'sales_savvy_cart';

const getLocalCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: [], subtotal: 0, itemCount: 0 };
    return JSON.parse(raw);
  } catch (e) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }
};

const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart to localStorage', e);
  }
  return cart;
};

export const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      if (response.data && Array.isArray(response.data.items)) {
        return response.data;
      }
    } catch (err) {
      // API not available, use local cart
    }
    return getLocalCart();
  },

  addToCart: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/items', { productId, quantity });
      if (response.data && Array.isArray(response.data.items)) {
        return response.data;
      }
    } catch (err) {
      // Fallback to local cart
    }

    const current = getLocalCart();
    const product = DEFAULT_PRODUCTS.find((p) => p.productId === Number(productId)) || {
      productId: Number(productId),
      productName: 'Product ' + productId,
      price: 999,
      images: [],
    };

    const existingIndex = current.items.findIndex(
      (item) => item.product?.productId === Number(productId)
    );

    if (existingIndex > -1) {
      current.items[existingIndex].quantity += quantity;
      current.items[existingIndex].itemTotal =
        current.items[existingIndex].quantity * current.items[existingIndex].product.price;
    } else {
      current.items.push({
        cartItemId: Date.now() + Math.floor(Math.random() * 1000),
        product: product,
        quantity: quantity,
        itemTotal: product.price * quantity,
      });
    }

    current.subtotal = current.items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
    current.itemCount = current.items.reduce((sum, item) => sum + item.quantity, 0);

    return saveLocalCart(current);
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      if (response.data && Array.isArray(response.data.items)) {
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocalCart();
    const index = current.items.findIndex((item) => String(item.cartItemId) === String(itemId));

    if (index > -1) {
      if (quantity <= 0) {
        current.items.splice(index, 1);
      } else {
        current.items[index].quantity = quantity;
        current.items[index].itemTotal = current.items[index].quantity * current.items[index].product.price;
      }
    }

    current.subtotal = current.items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
    current.itemCount = current.items.reduce((sum, item) => sum + item.quantity, 0);

    return saveLocalCart(current);
  },

  removeItem: async (itemId) => {
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      if (response.data && Array.isArray(response.data.items)) {
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    const current = getLocalCart();
    current.items = current.items.filter((item) => String(item.cartItemId) !== String(itemId));
    current.subtotal = current.items.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
    current.itemCount = current.items.reduce((sum, item) => sum + item.quantity, 0);

    return saveLocalCart(current);
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      if (response.data) return response.data;
    } catch (err) {
      // Fallback
    }

    const empty = { items: [], subtotal: 0, itemCount: 0 };
    return saveLocalCart(empty);
  },
};
