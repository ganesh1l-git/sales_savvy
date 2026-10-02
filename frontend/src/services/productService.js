import api from './api';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../data/productCatalog';

/**
 * Normalizes any product representation (Supabase, Spring Boot DTO, or Fallback Catalog)
 * into a single unified object supporting all naming conventions simultaneously.
 */
export const normalizeProduct = (item) => {
  if (!item) return null;

  const productId = item.productId || item.product_id || item.id;
  const name = item.name || item.product_name || item.productName || `Product #${productId}`;
  const description = item.description || '';
  const price = Number(item.price) || 0;
  const stock = item.stock !== undefined
    ? Number(item.stock)
    : (item.stock_quantity !== undefined ? Number(item.stock_quantity) : (item.stockQuantity !== undefined ? Number(item.stockQuantity) : 10));
  const subCategory = item.subCategory || item.sub_category || '';

  // Extract Category
  let categoryId = item.categoryId || item.category_id;
  let categoryName = item.categoryName || '';

  const catObj = Array.isArray(item.categories) ? item.categories[0] : item.categories;
  if (catObj && catObj.category_name) {
    categoryId = catObj.category_id || categoryId;
    categoryName = catObj.category_name;
  } else if (item.category) {
    if (typeof item.category === 'object') {
      categoryId = item.category.categoryId || item.category.category_id || categoryId;
      categoryName = item.category.categoryName || item.category.category_name || categoryName;
    } else if (typeof item.category === 'string') {
      categoryName = item.category;
    }
  }

  // Fallback category lookup by categoryId if categoryName is still generic or missing
  if ((!categoryName || categoryName === 'General') && categoryId) {
    const matchedCat = DEFAULT_CATEGORIES.find((c) => Number(c.categoryId) === Number(categoryId));
    if (matchedCat) {
      categoryName = matchedCat.categoryName;
    }
  }
  if (!categoryName) {
    categoryName = 'General';
  }

  // Extract Images
  let imageUrls = [];
  if (Array.isArray(item.imageUrls) && item.imageUrls.length > 0) {
    imageUrls = item.imageUrls.filter(Boolean);
  } else if (Array.isArray(item.product_images) && item.product_images.length > 0) {
    imageUrls = item.product_images
      .map((img) => (typeof img === 'string' ? img : img.image_url || img.imageUrl))
      .filter(Boolean);
  } else if (Array.isArray(item.images) && item.images.length > 0) {
    imageUrls = item.images
      .map((img) => (typeof img === 'string' ? img : img.imageUrl || img.image_url))
      .filter(Boolean);
  } else if (item.imageUrl) {
    imageUrls = [item.imageUrl];
  }

  // Fallback to catalog image if available for this productId or name
  if (imageUrls.length === 0 && (productId || name)) {
    const catalogItem = DEFAULT_PRODUCTS.find(
      (p) =>
        (productId && Number(p.productId) === Number(productId)) ||
        (name && p.productName && p.productName.toLowerCase() === name.toLowerCase())
    );
    if (catalogItem) {
      if (Array.isArray(catalogItem.images) && catalogItem.images.length > 0) {
        imageUrls = catalogItem.images
          .map((img) => (typeof img === 'string' ? img : img.imageUrl))
          .filter(Boolean);
      } else if (Array.isArray(catalogItem.imageUrls) && catalogItem.imageUrls.length > 0) {
        imageUrls = catalogItem.imageUrls.filter(Boolean);
      }
    }
  }

  if (imageUrls.length === 0) {
    imageUrls = ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'];
  }

  const images = imageUrls.map((url) => ({ imageUrl: url }));

  return {
    productId: productId ? Number(productId) : null,
    id: productId ? Number(productId) : null,
    name,
    productName: name,
    description,
    price,
    stock,
    stockQuantity: stock,
    subCategory,
    categoryId: categoryId ? Number(categoryId) : null,
    categoryName,
    category: {
      categoryId: categoryId ? Number(categoryId) : null,
      categoryName,
    },
    imageUrls,
    images,
    imageUrl: imageUrls[0],
    createdAt: item.created_at || item.createdAt || new Date().toISOString(),
  };
};

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
          return data.map(normalizeProduct);
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
        return response.data.map(normalizeProduct);
      }
    } catch (err) {
      // Backend not running or endpoint not found on Vercel
    }

    // 3. Fallback to resilient bundled product catalog
    let filtered = DEFAULT_PRODUCTS.map(normalizeProduct);
    if (categoryId) {
      filtered = filtered.filter((p) => p.categoryId === Number(categoryId));
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
        return {
          ...response.data,
          content: response.data.content.map(normalizeProduct),
        };
      }
    } catch (err) {
      // Backend not reachable
    }

    const normalizedCatalog = DEFAULT_PRODUCTS.map(normalizeProduct);
    const page = Number(params.page) || 0;
    const size = Number(params.size) || 20;
    const start = page * size;
    const paginated = normalizedCatalog.slice(start, start + size);
    return {
      content: paginated,
      totalElements: normalizedCatalog.length,
      totalPages: Math.ceil(normalizedCatalog.length / size),
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
          return normalizeProduct(data);
        }
      } catch (err) {
        console.warn('Supabase product query error:', err.message);
      }
    }

    // 2. Try Backend API
    try {
      const response = await api.get(`/products/${id}`);
      if (response.data && typeof response.data === 'object') {
        return normalizeProduct(response.data);
      }
    } catch (err) {
      // Fallback
    }

    // 3. Fallback
    const found = DEFAULT_PRODUCTS.find((p) => Number(p.productId) === Number(id));
    if (found) return normalizeProduct(found);
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
            categoryId: Number(c.category_id),
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
        return response.data.map((c) => ({
          categoryId: Number(c.categoryId || c.category_id),
          categoryName: c.categoryName || c.category_name,
        }));
      }
    } catch (err) {
      // Fallback
    }

    // 3. Fallback
    return DEFAULT_CATEGORIES;
  },
};

