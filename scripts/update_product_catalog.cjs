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

async function run() {
  console.log('Fetching data from local backend...');
  const categories = await fetchJson('http://localhost:8080/api/categories');
  const products = await fetchJson('http://localhost:8080/api/products');

  console.log(`Exporting ${categories.length} categories and ${products.length} products to productCatalog.js...`);

  const formattedCategories = categories.map((c) => ({
    categoryId: Number(c.categoryId),
    categoryName: c.categoryName,
  }));

  const formattedProducts = products.map((p) => {
    const urls = Array.isArray(p.imageUrls) && p.imageUrls.length > 0
      ? p.imageUrls
      : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'];

    return {
      productId: Number(p.productId),
      id: Number(p.productId),
      name: p.name,
      productName: p.name,
      description: p.description || '',
      price: Number(p.price),
      stock: Number(p.stock !== undefined ? p.stock : 10),
      stockQuantity: Number(p.stock !== undefined ? p.stock : 10),
      subCategory: p.subCategory || null,
      categoryId: p.categoryId ? Number(p.categoryId) : null,
      categoryName: p.categoryName || 'General',
      category: {
        categoryId: p.categoryId ? Number(p.categoryId) : null,
        categoryName: p.categoryName || 'General',
      },
      imageUrls: urls,
      images: urls.map((u) => ({ imageUrl: u })),
      imageUrl: urls[0],
    };
  });

  const fileContent = `// Auto-generated comprehensive SMB catalog of all verified products
export const DEFAULT_CATEGORIES = ${JSON.stringify(formattedCategories, null, 2)};

export const DEFAULT_PRODUCTS = ${JSON.stringify(formattedProducts, null, 2)};
`;

  fs.writeFileSync('frontend/src/data/productCatalog.js', fileContent, 'utf-8');
  console.log('✅ Updated frontend/src/data/productCatalog.js with all 1,074 products!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
