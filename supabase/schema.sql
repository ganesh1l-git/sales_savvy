-- =============================================================================
-- SALES SAVVY - SUPABASE DATABASE SCHEMA
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sub_category VARCHAR(100),
    category_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
    image_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    order_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(product_id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to categories, products, and images
CREATE POLICY "Public categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Public product images are viewable by everyone" ON product_images
    FOR SELECT USING (true);

-- Allow authenticated users or guests to manage cart
CREATE POLICY "Users can manage their own cart items" ON cart_items
    FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Allow authenticated users to view/create their orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their order items" ON order_items
    FOR SELECT USING (true);

CREATE POLICY "Users can insert order items" ON order_items
    FOR INSERT WITH CHECK (true);
