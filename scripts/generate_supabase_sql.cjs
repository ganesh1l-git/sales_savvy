const fs = require('fs');
const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

async function run() {
  console.log('Fetching categories and products from local backend...');
  const categories = await fetchJson('http://localhost:8080/api/categories');
  const products = await fetchJson('http://localhost:8080/api/products');

  console.log(`Found ${categories.length} categories and ${products.length} products.`);

  // 1. Categories SQL
  const categoryValues = categories
    .sort((a, b) => a.categoryId - b.categoryId)
    .map((c) => `    (${c.categoryId}, ${escapeSql(c.categoryName)})`)
    .join(',\n');

  // 2. Products SQL
  const productValues = products
    .sort((a, b) => a.productId - b.productId)
    .map((p) => {
      const name = escapeSql(p.name);
      const desc = escapeSql(p.description || '');
      const price = Number(p.price).toFixed(2);
      const stock = Number(p.stock !== undefined ? p.stock : 10);
      const subCat = escapeSql(p.subCategory);
      const catId = p.categoryId ? Number(p.categoryId) : 'NULL';
      return `    (${p.productId}, ${name}, ${desc}, ${price}, ${stock}, ${subCat}, ${catId})`;
    })
    .join(',\n');

  // 3. Product Images SQL
  const imageRows = [];
  products
    .sort((a, b) => a.productId - b.productId)
    .forEach((p) => {
      if (Array.isArray(p.imageUrls)) {
        p.imageUrls.forEach((url) => {
          if (url && url.trim()) {
            imageRows.push(`    (${p.productId}, ${escapeSql(url.trim())})`);
          }
        });
      }
    });

  const imageValues = imageRows.join(',\n');

  console.log(`Total image records to insert: ${imageRows.length}`);

  // Combine into complete supabase_setup.sql
  const setupSql = `-- =============================================================================
-- SALES SAVVY - COMPLETE SUPABASE SETUP SCRIPT (SCHEMA + FULL 1,074 PRODUCTS + RLS)
-- Auto-generated from local MySQL SMB inventory dataset
--
-- How to run:
-- 1. Open Supabase Dashboard -> SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- 2. Paste this entire script and click "Run" (or Ctrl + Enter)
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. DROP EXISTING TABLES IF ANY (Clean Slate)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. CREATE TABLES
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    sub_category VARCHAR(100),
    category_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_images (
    image_id BIGSERIAL PRIMARY KEY,
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    product_id BIGINT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE orders (
    order_id BIGSERIAL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid(),
    total_amount NUMERIC(12, 2) NOT NULL,
    shipping_amount NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'PENDING',
    payment_method VARCHAR(50) DEFAULT 'RAZORPAY',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(product_id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL
);

-- 3. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON products(sub_category);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 4. GRANT PERMISSIONS TO POSTGREST ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES
CREATE POLICY "Public categories viewable by everyone" ON categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public products viewable by everyone" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public product images viewable by everyone" ON product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Cart items manage" ON cart_items FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Orders viewable" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Orders insertable" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Order items viewable" ON order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Order items insertable" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 7. SEED ALL ${categories.length} CATEGORIES
INSERT INTO categories (category_id, category_name) VALUES
${categoryValues}
ON CONFLICT (category_id) DO UPDATE SET category_name = EXCLUDED.category_name;

-- 8. SEED ALL ${products.length} PRODUCTS
INSERT INTO products (product_id, product_name, description, price, stock_quantity, sub_category, category_id) VALUES
${productValues}
ON CONFLICT (product_id) DO UPDATE SET
    product_name = EXCLUDED.product_name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    sub_category = EXCLUDED.sub_category,
    category_id = EXCLUDED.category_id;

-- 9. SEED ALL ${imageRows.length} PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url) VALUES
${imageValues};

-- 10. RESET POSTGRES AUTO-INCREMENT SEQUENCES
SELECT setval('categories_category_id_seq', COALESCE((SELECT MAX(category_id) FROM categories), 1));
SELECT setval('products_product_id_seq', COALESCE((SELECT MAX(product_id) FROM products), 1));
SELECT setval('product_images_image_id_seq', COALESCE((SELECT MAX(image_id) FROM product_images), 1));
`;

  fs.writeFileSync('supabase_setup.sql', setupSql, 'utf-8');
  console.log('✅ Wrote supabase_setup.sql successfully!');

  // Also write separate seed file for existing databases
  const seedOnlySql = `-- SALES SAVVY - PRODUCTS & CATEGORIES DATA ONLY
INSERT INTO categories (category_id, category_name) VALUES
${categoryValues}
ON CONFLICT (category_id) DO UPDATE SET category_name = EXCLUDED.category_name;

INSERT INTO products (product_id, product_name, description, price, stock_quantity, sub_category, category_id) VALUES
${productValues}
ON CONFLICT (product_id) DO UPDATE SET
    product_name = EXCLUDED.product_name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    stock_quantity = EXCLUDED.stock_quantity,
    sub_category = EXCLUDED.sub_category,
    category_id = EXCLUDED.category_id;

INSERT INTO product_images (product_id, image_url) VALUES
${imageValues}
ON CONFLICT DO NOTHING;

SELECT setval('categories_category_id_seq', COALESCE((SELECT MAX(category_id) FROM categories), 1));
SELECT setval('products_product_id_seq', COALESCE((SELECT MAX(product_id) FROM products), 1));
SELECT setval('product_images_image_id_seq', COALESCE((SELECT MAX(image_id) FROM product_images), 1));
`;
  fs.writeFileSync('supabase_seed_all.sql', seedOnlySql, 'utf-8');
  console.log('✅ Wrote supabase_seed_all.sql successfully!');
}

run().catch((err) => {
  console.error('Export failed:', err);
  process.exit(1);
});
