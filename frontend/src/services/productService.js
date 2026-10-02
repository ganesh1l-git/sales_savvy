import api from './api';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../data/productCatalog';

export const productService = {
  getAllProducts: async (categoryId = null, subCategory = null, search = '') => {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase.from('products').select(`
          product_id,
          product_name,
          description,
          price,
          stock_quantity,
          sub_category,
          category_id,
          categories (
            category_id,
            category_name
          ),
          product_images (
            image_url
          )
        `);

        if (categoryId) {
          query = query.eq('category_id', Number(categoryId));
        }
        if (subCategory) {
          query = query.eq('sub_category', subCategory);
        }
        if (search) {
          query = query.ilike('product_name', `%${search}%`);
        }

        const { data, error } = await query;
        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((item) => ({
            productId: item.product_id,
            productName: item.product_name,
            description: item.description,
            price: Number(item.price),
            stockQuantity: item.stock_quantity,
            subCategory: item.sub_category,
            category: {
              categoryId: item.categories?.category_id || item.category_id,
              categoryName: item.categories?.category_name || 'General',
            },
            images: (item.product_images || []).map((img) => ({ imageUrl: img.image_url })),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back:', err.message);
      }
    }

    // 2. Try Local / Remote Spring Boot API
    try {
      const params = {};
      if (categoryId) params.categoryId = categoryId;
      if (subCategory) params.subCategory = subCategory;
      if (search) params.search = search;
      const response = await api.get('/products', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      // Backend not running or endpoint not found on Vercel
    }

    // 3. Fallback to resilient bundled product catalog
    let filtered = [...DEFAULT_PRODUCTS];
    if (categoryId) {
      filtered = filtered.filter((p) => p.category?.categoryId === Number(categoryId));
    }
    if (subCategory) {
      filtered = filtered.filter(
        (p) => p.subCategory && p.subCategory.toLowerCase() === subCategory.toLowerCase()
      );
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  },

  getProductsPage: async (params = {}) => {
    try {
      const response = await api.get('/products/page', { params });
      if (response.data && Array.isArray(response.data.content)) {
        return response.data;
      }
    } catch (err) {
      // Backend not reachable
    }

    const page = Number(params.page) || 0;
    const size = Number(params.size) || 20;
    const start = page * size;
    const paginated = DEFAULT_PRODUCTS.slice(start, start + size);
    return {
      content: paginated,
      totalElements: DEFAULT_PRODUCTS.length,
      totalPages: Math.ceil(DEFAULT_PRODUCTS.length / size),
      number: page,
      size: size,
    };
  },

  getProductById: async (id) => {
    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            product_id,
            product_name,
            description,
            price,
            stock_quantity,
            sub_category,
            category_id,
            categories (
              category_id,
              category_name
            ),
            product_images (
              image_url
            )
          `)
          .eq('product_id', Number(id))
          .single();

        if (!error && data) {
          return {
            productId: data.product_id,
            productName: data.product_name,
            description: data.description,
            price: Number(data.price),
            stockQuantity: data.stock_quantity,
            subCategory: data.sub_category,
            category: {
              categoryId: data.categories?.category_id || data.category_id,
              categoryName: data.categories?.category_name || 'General',
            },
            images: (data.product_images || []).map((img) => ({ imageUrl: img.image_url })),
          };
        }
      } catch (err) {
        console.warn('Supabase product query error:', err.message);
      }
    }

    // 2. Try Backend API
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data && typeof response.data === 'object') {
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    // 3. Fallback
    const found = DEFAULT_PRODUCTS.find((p) => p.productId === Number(id));
    if (found) return found;
    throw new Error('Product not found');
  },

  getCategories: async () => {
    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('category_id, category_name')
          .order('category_id', { ascending: true });

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map((c) => ({
            categoryId: c.category_id,
            categoryName: c.category_name,
          }));
        }
      } catch (err) {
        console.warn('Supabase categories error:', err.message);
      }
    }

    // 2. Try Backend API
    try {
      const response = await api.get('/categories');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      // Fallback
    }

    // 3. Fallback
    return DEFAULT_CATEGORIES;
  },
};
