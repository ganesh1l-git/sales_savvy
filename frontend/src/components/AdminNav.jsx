import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, Tags, ShoppingCart, CreditCard, BarChart3 } from 'lucide-react';

export const AdminNav = () => {
  const navItems = [
    { to: '/adminhome', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={18} /> },
    { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/admin/categories', label: 'Categories', icon: <Tags size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { to: '/admin/payments', label: 'Payments', icon: <CreditCard size={18} /> },
    { to: '/admin/reports', label: 'Reports', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '32px'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '12px 0'
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/adminhome'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'var(--transition)'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
