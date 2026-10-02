import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const displayName = product.name || product.productName || `Product #${product.productId || ''}`;
  const displayCategory = product.categoryName || product.category?.categoryName || 'General';
  const displayStock = product.stock !== undefined
    ? Number(product.stock)
    : (product.stockQuantity !== undefined ? Number(product.stockQuantity) : 10);
  const isOutOfStock = displayStock <= 0;

  const imageUrl = (Array.isArray(product.imageUrls) && product.imageUrls.length > 0 && product.imageUrls[0])
    || (Array.isArray(product.images) && product.images.length > 0 && (product.images[0].imageUrl || product.images[0].image_url || (typeof product.images[0] === 'string' ? product.images[0] : null)))
    || product.imageUrl
    || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      setAdding(true);
      setErrorMsg('');
      await addToCart(product.productId, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Could not add to cart');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.productId}`} style={{ display: 'block' }}>
        <div className="product-image-container">
          <img
            src={imageUrl}
            alt={displayName}
            className="product-image"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-card-body" style={{ padding: '14px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span className="product-category-tag" style={{ color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 700 }}>
            {displayCategory}
          </span>
          {product.subCategory && (
            <span style={{ fontSize: '0.7rem', background: '#f1f3f6', color: '#616161', padding: '1px 6px', borderRadius: '3px', fontWeight: 600 }}>
              {product.subCategory}
            </span>
          )}
        </div>
        
        <Link to={`/products/${product.productId}`}>
          <h3 className="product-title" title={displayName} style={{ fontSize: '0.9rem', fontWeight: 600, color: '#212121', marginBottom: '6px', lineHeight: 1.3 }}>
            {displayName}
          </h3>
        </Link>

        {/* Rating badge like Flipkart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{
            background: '#388e3c',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '2px 6px',
            borderRadius: '3px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px'
          }}>
            4.2 ★
          </span>
          <span style={{ fontSize: '0.78rem', color: '#878787' }}>
            ({Math.floor(100 + (product.productId * 47) % 800)})
          </span>
        </div>

        <div className="product-price-row" style={{ paddingTop: '4px', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
            <span className="product-price" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#212121' }}>
              ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#878787', textDecoration: 'line-through' }}>
              ₹{Number(Math.round(product.price * 1.3)).toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.78rem', color: '#388e3c', fontWeight: 700 }}>
              23% off
            </span>
          </div>

          <span className={`product-stock ${isOutOfStock ? 'stock-out' : 'stock-in'}`} style={{ fontSize: '0.72rem', padding: '2px 6px' }}>
            {isOutOfStock ? 'Out of Stock' : 'In Stock'}
          </span>
        </div>

        {errorMsg && (
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--danger)',
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <AlertCircle size={14} /> {errorMsg}
          </div>
        )}

        {!isAdmin && (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`btn ${added ? 'btn-secondary' : 'btn-accent'} btn-sm btn-block`}
            style={{ marginTop: '12px', fontWeight: 700 }}
          >
            {added ? (
              <>
                <Check size={16} color="var(--success)" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={15} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
