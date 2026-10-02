import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, ShieldCheck, MapPin, CreditCard } from 'lucide-react';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await orderService.getOrderById(id);
        setOrder(data);
      } catch (err) {
        setErrorMsg('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (errorMsg || !order) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{errorMsg}</p>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  // Tracking Timeline steps
  const steps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Received & Pending Payment' },
    { key: 'APPROVED', label: 'Payment Approved', desc: 'Verified & Preparing Dispatch' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'In Transit with Carrier' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Delivered to Customer' },
  ];

  const getStepStatus = (stepKey) => {
    if (order.status === 'CANCELLED') return 'cancelled';
    const statusOrder = ['PENDING', 'APPROVED', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(order.status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex <= currentIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      {/* Order Header */}
      <div className="card" style={{ padding: '24px 32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order #{order.orderId}</h1>
              <span className={`badge ${order.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-approved'}`}>
                {order.status}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'N/A'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Grand Total</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>
              ₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>
            Fulfillment Tracking
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            position: 'relative'
          }}>
            {steps.map((s, index) => {
              const status = getStepStatus(s.key);
              const isCompleted = status === 'completed';
              return (
                <div key={s.key} style={{ textAlign: 'center', position: 'relative' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isCompleted ? 'var(--primary)' : 'var(--bg-subtle)',
                    color: isCompleted ? '#fff' : 'var(--text-muted)',
                    boxShadow: isCompleted ? '0 4px 10px var(--primary-glow)' : 'none',
                    fontWeight: 700,
                    zIndex: 2,
                    position: 'relative'
                  }}>
                    {isCompleted ? <CheckCircle2 size={22} /> : index + 1}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: isCompleted ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Order Items & Delivery Information */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Order Items Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Items Purchased ({order.items?.length || 0})</h3>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price (Historical)</th>
                  <th>Qty</th>
                  <th>Line Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'}
                          alt=""
                          style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600 }}>{item.productName}</span>
                      </div>
                    </td>
                    <td>₹{Number(item.pricePerUnit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td style={{ fontWeight: 700 }}>{item.quantity}</td>
                    <td style={{ fontWeight: 800 }}>
                      ₹{Number(item.totalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '20px 24px', background: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
              <span style={{ fontWeight: 600 }}>₹{Number(order.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping ({order.shippingOption}):</span>
              <span style={{ fontWeight: 600 }}>₹{Number(order.shippingCharge).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>₹{Number(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shipping Card */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <MapPin size={18} color="var(--primary)" /> Shipping Address
            </h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.5, background: 'var(--bg-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
              {order.shippingAddress || 'Standard Profile Address'}
            </p>
            <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Selected Carrier Method: <strong>{order.shippingOption} Dispatch</strong>
            </div>
          </div>

          {/* Payment Card */}
          <div className="card">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CreditCard size={18} color="var(--primary)" /> Payment Information
            </h4>
            <div style={{ fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span className={`badge ${order.payment?.status === 'SUCCESS' ? 'badge-success' : 'badge-pending'}`}>
                  {order.payment?.status || 'PENDING'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gateway Method:</span>
                <span style={{ fontWeight: 600 }}>{order.payment?.paymentMethod || 'Razorpay Gateway'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gateway Order ID:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{order.payment?.gatewayOrderId || 'N/A'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Gateway Payment ID:</span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{order.payment?.gatewayPaymentId || 'Verified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
