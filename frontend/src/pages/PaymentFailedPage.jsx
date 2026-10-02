import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react';

export const PaymentFailedPage = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const errorMsg = searchParams.get('error') || 'The transaction could not be verified or was declined.';

  return (
    <div className="container" style={{ padding: '80px 24px', minHeight: '75vh', textAlign: 'center' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }} className="card">
        <div style={{
          display: 'inline-flex',
          padding: '20px',
          borderRadius: '50%',
          background: 'var(--danger-bg)',
          color: 'var(--danger)',
          marginBottom: '20px'
        }}>
          <XCircle size={56} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
          Payment Incomplete
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Your payment could not be processed. Your cart items are preserved so you can retry checkout.
        </p>

        <div className="alert alert-danger" style={{ textAlign: 'left', marginBottom: '28px' }}>
          <AlertCircle size={20} />
          <div>
            <strong>Error Details:</strong>
            <div style={{ fontSize: '0.85rem', marginTop: '2px' }}>{errorMsg}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link to="/checkout" className="btn btn-primary">
            <RefreshCw size={18} /> Retry Payment
          </Link>
          <Link to="/cart" className="btn btn-secondary">
            <ShoppingCart size={18} /> Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};
