import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { CategoryHeaderBar } from '../components/CategoryHeaderBar';
import { Search, X, SlidersHorizontal, Tag } from 'lucide-react';

export const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const initialSubCategory = searchParams.get('subCategory') || null;

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategoryName, setSelectedCategoryName] = useState(initialCategory);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let categoryId = null;
        if (selectedCategoryName && selectedCategoryName !== 'all') {
          const match = categories.find(
            (c) => c.categoryName.toLowerCase() === selectedCategoryName.toLowerCase()
          );
          if (match) {
            categoryId = match.categoryId;
          }
        }

        const data = await productService.getAllProducts(categoryId, selectedSubCategory, searchTerm);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedCategoryName, selectedSubCategory, searchTerm, categories]);

  // Client-side sorting and stock filtering
  const filteredProducts = products
    .filter((p) => (!inStockOnly ? true : p.stock > 0))
    .sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
      if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.productId - a.productId;
    });

  return (
    <div style={{ minHeight: '85vh', paddingBottom: '60px' }}>
      {/* 1. Category Bar & Subcategories at top (Matches Image 1, 2, and 3) */}
      <CategoryHeaderBar
        selectedCategory={selectedCategoryName}
        onSelectCategory={(catName) => {
          setSelectedCategoryName(catName);
          setSelectedSubCategory(null);
        }}
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={(subCat) => setSelectedSubCategory(subCat)}
      />

      <div className="container" style={{ padding: '36px 20px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            Product Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Showing {filteredProducts.length} verified SMB inventory products
            {selectedSubCategory && <strong> in {selectedSubCategory}</strong>}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '32px', alignItems: 'start' }}>
          {/* Sidebar Filters */}
          <aside className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: 700 }}>
              <SlidersHorizontal size={18} color="var(--primary)" /> Filters
            </div>

            {/* Search in sidebar */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Search Keywords</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>Department</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => {
                    setSelectedCategoryName('all');
                    setSelectedSubCategory(null);
                  }}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    fontWeight: selectedCategoryName === 'all' ? 700 : 500,
                    background: selectedCategoryName === 'all' ? 'var(--primary-light)' : 'transparent',
                    color: selectedCategoryName === 'all' ? 'var(--primary)' : 'var(--text-main)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  All Categories
                </button>

                {categories.map((c) => (
                  <button
                    key={c.categoryId}
                    onClick={() => {
                      setSelectedCategoryName(c.categoryName);
                      setSelectedSubCategory(null);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: selectedCategoryName === c.categoryName ? 700 : 500,
                      background: selectedCategoryName === c.categoryName ? 'var(--primary-light)' : 'transparent',
                      color: selectedCategoryName === c.categoryName ? 'var(--primary)' : 'var(--text-main)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {c.categoryName}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Filter */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                In Stock Only
              </label>
            </div>

            {/* Active Subcategory Pill */}
            {selectedSubCategory && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Active Subcategory:
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  border: '1px solid rgba(0, 113, 227, 0.2)'
                }}>
                  <span>{selectedSubCategory}</span>
                  <button
                    onClick={() => setSelectedSubCategory(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* Main Product Listing */}
          <main>
            {/* Header Toolbar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '12px 18px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                Showing <strong>{filteredProducts.length}</strong> items
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                    background: '#fff'
                  }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                <div className="spinner"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No products match your filter criteria.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryName('all');
                    setSelectedSubCategory(null);
                    setSearchTerm('');
                    setInStockOnly(false);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: '14px' }}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid-cols-3">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.productId} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
