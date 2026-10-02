import { createClient } from '@supabase/supabase-js';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from '../frontend/src/data/productCatalog.js';

const supabaseUrl = process.argv[2] || process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.argv[3] || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Error: Missing Supabase credentials.');
  console.log('\nUsage:');
  console.log('  node scripts/seedSupabase.js <SUPABASE_URL> <SUPABASE_KEY>\n');
  console.log('Example:');
  console.log('  node scripts/seedSupabase.js https://xyzcompany.supabase.co eyJhbGciOi...\n');
  console.log('Or run supabase_setup.sql directly in the Supabase Dashboard SQL Editor.\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🚀 Connecting to Supabase at:', supabaseUrl);

  // 1. Seed Categories
  console.log('\n📦 Seeding Categories...');
  for (const cat of DEFAULT_CATEGORIES) {
    const { error } = await supabase
      .from('categories')
      .upsert({
        category_id: cat.categoryId,
        category_name: cat.categoryName,
      }, { onConflict: 'category_id' });

    if (error) {
      console.warn(`⚠️ Category ${cat.categoryName}:`, error.message);
    } else {
      console.log(`  ✓ Category: ${cat.categoryName}`);
    }
  }

  // 2. Seed Products
  console.log('\n🛍️ Seeding Products & Images...');
  for (const prod of DEFAULT_PRODUCTS) {
    const { error: prodErr } = await supabase
      .from('products')
      .upsert({
        product_id: prod.productId,
        product_name: prod.productName,
        description: prod.description,
        price: prod.price,
        stock_quantity: prod.stockQuantity,
        sub_category: prod.subCategory,
        category_id: prod.category.categoryId,
      }, { onConflict: 'product_id' });

    if (prodErr) {
      console.warn(`⚠️ Product ${prod.productName}:`, prodErr.message);
      continue;
    }

    if (prod.images && prod.images.length > 0) {
      for (const img of prod.images) {
        await supabase
          .from('product_images')
          .insert({
            product_id: prod.productId,
            image_url: img.imageUrl,
          });
      }
    }
    console.log(`  ✓ Product [${prod.subCategory}]: ${prod.productName.slice(0, 45)}...`);
  }

  console.log('\n🎉 Supabase seeding completed successfully!\n');
}

seed().catch((err) => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
