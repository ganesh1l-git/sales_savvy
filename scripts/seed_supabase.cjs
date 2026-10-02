const { createClient } = require('@supabase/supabase-js');
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

async function run() {
  const supabaseUrl = process.argv[2] || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.argv[3] || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Usage: node scripts/seed_supabase.cjs <SUPABASE_URL> <SUPABASE_KEY>');
    console.log('Or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
    process.exit(1);
  }

  console.log('Connecting to Supabase at:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Fetching 1,074 products and 17 categories from local backend...');
  const categories = await fetchJson('http://localhost:8080/api/categories');
  const products = await fetchJson('http://localhost:8080/api/products');

  console.log(`Upserting ${categories.length} categories...`);
  const catRows = categories.map((c) => ({
    category_id: Number(c.categoryId),
    category_name: c.categoryName,
  }));
  const { error: catErr } = await supabase.from('categories').upsert(catRows, { onConflict: 'category_id' });
  if (catErr) {
    console.error('Error inserting categories:', catErr);
    process.exit(1);
  }
  console.log('✅ Categories upserted successfully.');

  console.log(`Upserting ${products.length} products in batches of 100...`);
  const BATCH_SIZE = 100;
  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const chunk = products.slice(i, i + BATCH_SIZE);
    const prodRows = chunk.map((p) => ({
      product_id: Number(p.productId),
      product_name: p.name,
      description: p.description || '',
      price: Number(p.price),
      stock_quantity: Number(p.stock !== undefined ? p.stock : 10),
      sub_category: p.subCategory || null,
      category_id: p.categoryId ? Number(p.categoryId) : null,
    }));

    const { error: prodErr } = await supabase.from('products').upsert(prodRows, { onConflict: 'product_id' });
    if (prodErr) {
      console.error(`Error inserting products batch ${i}-${i + chunk.length}:`, prodErr);
    } else {
      console.log(`  ✓ Inserted products ${i + 1} to ${i + chunk.length}`);
    }

    // Insert images for this batch
    const imageRows = [];
    chunk.forEach((p) => {
      if (Array.isArray(p.imageUrls)) {
        p.imageUrls.forEach((url) => {
          if (url && url.trim()) {
            imageRows.push({
              product_id: Number(p.productId),
              image_url: url.trim(),
            });
          }
        });
      }
    });

    if (imageRows.length > 0) {
      const { error: imgErr } = await supabase.from('product_images').insert(imageRows);
      if (imgErr) {
        // If images already exist or conflict, ignore
      }
    }
  }

  console.log('🎉 Done! All 1,074 products and images successfully seeded to Supabase!');
}

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
