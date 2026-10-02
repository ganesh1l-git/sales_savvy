import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '60px 0 28px',
      marginTop: '80px',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        {/* Value Props Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          paddingBottom: '48px',
          borderBottom: '1px solid #1e293b',
          marginBottom: '48px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', color: '#38bdf8' }}>
              <Truck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Reliable Shipping</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>Standard & Express delivery</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', color: '#10b981' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>Secure Payments</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>Powered by Razorpay 256-bit</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', color: '#0071e3' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>SMB Verified</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>Tailored for high-growth commerce</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '12px', color: '#f59e0b' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>UPI & Cards</h4>
              <p style={{ fontSize: '0.82rem', marginTop: '2px' }}>Instant seamless checkout</p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 700 }}>
            <ShoppingBag size={18} color="#38bdf8" />
            <span>Sales Savvy E-Commerce Platform</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Sales Savvy Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
