import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, ShoppingCart, User, LogOut, Package, Shield, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { AccountDropdown } from './AccountDropdown';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to={isAdmin ? "/adminhome" : "/customerhome"} className="brand-logo">
          <div style={{
            background: 'var(--primary)',
            padding: '7px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <ShoppingBag size={20} />
          </div>
          <span style={{ fontWeight: 800 }}>Sales<span style={{ color: 'var(--accent)' }}>Savvy</span></span>
          {isAdmin && <span className="brand-badge">Admin</span>}
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="nav-search">
          <Search size={18} className="nav-search-icon" />
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {!isAdmin && (
            <>
              <Link to="/customerhome" className="nav-link">
                Home
              </Link>
              <Link to="/products" className="nav-link">
                Catalog
              </Link>
              <Link to="/cart" className="cart-btn" title="View Cart">
                <ShoppingCart size={20} />
                {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/adminhome" className="nav-link">
                <Shield size={16} /> Dashboard
              </Link>
              <Link to="/admin/orders" className="nav-link">
                <Package size={16} /> Orders
              </Link>
              <Link to="/admin/products" className="nav-link">
                <Layers size={16} /> Products
              </Link>
            </>
          )}

          {/* User Account Dropdown matching Image 4 */}
          {!isAdmin && <AccountDropdown />}

          {isAdmin && isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                background: '#e8f2fe',
                color: '#0071e3',
                padding: '5px 12px',
                borderRadius: '980px',
                fontSize: '0.82rem',
                fontWeight: 600,
                border: '1px solid rgba(0, 113, 227, 0.2)'
              }}>
                Admin ({user?.username})
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Sign out of admin"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}

          {!isAuthenticated && !isAdmin && (
            <Link to="/login" className="btn btn-primary btn-sm">
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
