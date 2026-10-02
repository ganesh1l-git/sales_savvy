import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { ProductCard } from '../components/ProductCard';
import { CategoryHeaderBar } from '../components/CategoryHeaderBar';
import { Sparkles, ArrowRight, Layers, Tag, ShieldCheck, Zap } from 'lucide-react';

export const CustomerHomePage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Initial Load: Fetch Categories
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

  // 2. Fetch Products whenever Category or SubCategory changes
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

        const prods = await productService.getAllProducts(categoryId, selectedSubCategory, '');
        setProducts(prods);
      } catch (err) {
        setError('Failed to load products. Please check backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryName, selectedSubCategory, categories]);

  return (
    <div style={{ minHeight: '80vh', paddingBottom: '60px' }}>
      {/* 1. TOP CATEGORY HEADER BAR (Matches 1st, 2nd, and 3rd Images) */}
      <CategoryHeaderBar
        selectedCategory={selectedCategoryName}
        onSelectCategory={(catName) => {
          setSelectedCategoryName(catName);
          setSelectedSubCategory(null);
        }}
        selectedSubCategory={selectedSubCategory}
        onSelectSubCategory={(subCat) => setSelectedSubCategory(subCat)}
      />

      {/* 2. Hero Banner - Only shown in For You section (Simple & Light Flipkart/Amazon Style) */}
      {selectedCategoryName === 'all' && !selectedSubCategory && (
        <div className="container" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <div style={{
            background: 'linear-gradient(90deg, #eef5ff 0%, #ffffff 55%, #fff9ec 100%)',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <div style={{ maxWidth: '640px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#2874f0',
                marginBottom: '10px',
                border: '1px solid #d0e2ff'
              }}>
                <Sparkles size={14} color="#ff9f00" /> Big Savings on Authentic SMB Inventory
              </div>
              
              <h1 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#212121',
                marginBottom: '8px'
              }}>
                Direct Quality Goods, <span style={{ color: '#2874f0' }}>Curated for You.</span>
              </h1>

              <p style={{
                fontSize: '0.92rem',
                color: '#616161',
                lineHeight: 1.5,
                marginBottom: '18px',
                maxWidth: '560px'
              }}>
                Genuine products sourced with real specifications, instant stock availability, and verified payment protection.
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary" style={{ padding: '8px 20px', fontWeight: 700 }}>
                  Explore Catalog <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => setSelectedCategoryName('Fashion')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontWeight: 600 }}
                >
                  Fashion Store
                </button>
                <button
                  onClick={() => setSelectedCategoryName('Electronics')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontWeight: 600 }}
                >
                  Tech & Gadgets
                </button>
              </div>
            </div>

            {/* Quick Feature Badges like Flipkart */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#ffffff',
              padding: '16px 20px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              minWidth: '220px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#212121' }}>
                <span style={{ color: '#388e3c', fontSize: '1.1rem' }}>✓</span> 100% Genuine Products
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#212121' }}>
                <span style={{ color: '#2874f0', fontSize: '1.1rem' }}>⚡</span> Fast SMB Dispatch
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#212121' }}>
                <span style={{ color: '#ff9f00', fontSize: '1.1rem' }}>🛡</span> Razorpay Protected
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Product Section */}
      <div className="container" id="featured-products" style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={22} color="var(--primary)" />
              {selectedCategoryName === 'all'
                ? 'Featured Catalog Items'
                : `${selectedCategoryName} Collection`}
              {selectedSubCategory && (
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 10px', borderRadius: '12px' }}>
                  / {selectedSubCategory}
                </span>
              )}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Showing {products.length} authentic inventory products
            </p>
          </div>

          <Link to="/products" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            View Full Catalog &rarr;
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : products.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No products found matching this filter.</p>
            <button
              onClick={() => {
                setSelectedCategoryName('all');
                setSelectedSubCategory(null);
              }}
              className="btn btn-primary btn-sm"
              style={{ marginTop: '14px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
