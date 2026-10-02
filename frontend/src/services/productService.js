import api from './api';

export const productService = {
  getAllProducts: async (categoryId = null, subCategory = null, search = '') => {
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (subCategory) params.subCategory = subCategory;
    if (search) params.search = search;
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductsPage: async (params = {}) => {
    const response = await api.get('/products/page', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  }
};
