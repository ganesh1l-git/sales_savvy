import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';

export const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  return (
    <div className="container" style={{ padding: '80px 24px', minHeight: '75vh', textAlign: 'center' }}>
      <div style={{ maxWidth: '540px', margin: '0 auto' }} className="card">
        <div style={{
          display: 'inline-flex',
          padding: '20px',
          borderRadius: '50%',
          background: 'var(--success-bg)',
          color: 'var(--success)',
          marginBottom: '20px'
        }}>
          <CheckCircle size={56} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Payment Successful!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '24px' }}>
          Thank you for your purchase. Your order has been placed and approved for dispatch.
        </p>

        <div style={{
          background: 'var(--bg-subtle)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          textAlign: 'left',
          marginBottom: '28px',
          border: '1px solid var(--border-color)',
          fontSize: '0.9rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Order Reference:</span>
            <span style={{ fontWeight: 700 }}>#{orderId || 'N/A'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Razorpay Payment ID:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{paymentId || 'Verified'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span className="badge badge-approved">Approved / Processing</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn btn-primary">
              <Package size={18} /> View Order Details
            </Link>
          )}
          <Link to="/orders" className="btn btn-secondary">
            Order History
          </Link>
          <Link to="/customerhome" className="btn btn-secondary">
            <Home size={18} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};
