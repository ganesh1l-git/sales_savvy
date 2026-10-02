import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { paymentService } from '../services/paymentService';
import { ShieldCheck, CreditCard, ArrowLeft, AlertCircle, CheckCircle, Truck } from 'lucide-react';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();

  const [shippingOption, setShippingOption] = useState(location.state?.shippingOption || 'STANDARD');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingCost = shippingOption === 'EXPRESS' ? 120 : 50;
  const grandTotal = Number(cart.subtotal || 0) + shippingCost;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      setErrorMsg('Please enter a delivery address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      // 1. Create Razorpay Payment order via backend
      const paymentOrder = await paymentService.createPaymentOrder({
        shippingOption,
        shippingAddress: shippingAddress.trim()
      });

      // 2. Open Razorpay Checkout or fallback test mode
      if (window.Razorpay) {
        const options = {
          key: paymentOrder.keyId,
          amount: paymentOrder.amountInPaise,
          currency: paymentOrder.currency,
          name: 'Sales Savvy',
          description: `Order #${paymentOrder.orderId}`,
          order_id: paymentOrder.razorpayOrderId.startsWith('order_mock_') ? undefined : paymentOrder.razorpayOrderId,
          prefill: {
            name: paymentOrder.customerName,
            email: paymentOrder.customerEmail,
          },
          theme: {
            color: '#0071e3',
          },
          handler: async (response) => {
            try {
              // 3. Verify Razorpay Payment via Backend
              await paymentService.verifyPayment({
                orderId: paymentOrder.orderId,
                razorpayOrderId: response.razorpay_order_id || paymentOrder.razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              await refreshCart();
              navigate(`/payment-success?orderId=${paymentOrder.orderId}&paymentId=${response.razorpay_payment_id}`);
            } catch (verifyErr) {
              navigate(`/payment-failed?orderId=${paymentOrder.orderId}&error=${encodeURIComponent(verifyErr.message)}`);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
        };

        // If mock gateway order ID was generated because of offline or demo keys
        if (paymentOrder.razorpayOrderId.startsWith('order_mock_')) {
          // Verify directly using mock signature
          await paymentService.verifyPayment({
            orderId: paymentOrder.orderId,
            razorpayOrderId: paymentOrder.razorpayOrderId,
            razorpayPaymentId: 'pay_mock_' + Date.now(),
            razorpaySignature: 'mock_signature',
          });
          await refreshCart();
          navigate(`/payment-success?orderId=${paymentOrder.orderId}&paymentId=pay_mock_${Date.now()}`);
          return;
        }

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          navigate(`/payment-failed?orderId=${paymentOrder.orderId}&error=${encodeURIComponent(response.error.description)}`);
        });
        rzp.open();
      } else {
        // Fallback for environments where checkout.js is blocked
        await paymentService.verifyPayment({
          orderId: paymentOrder.orderId,
          razorpayOrderId: paymentOrder.razorpayOrderId,
          razorpayPaymentId: 'pay_simulated_' + Date.now(),
          razorpaySignature: 'mock_signature',
        });
        await refreshCart();
        navigate(`/payment-success?orderId=${paymentOrder.orderId}&paymentId=pay_simulated_${Date.now()}`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <Link to="/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', marginBottom: '24px', fontWeight: 600 }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Shipping & Delivery Details */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>
            Delivery Information
          </h2>

          {errorMsg && (
            <div className="alert alert-danger">
              <AlertCircle size={18} /> {errorMsg}
            </div>
          )}

          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                value={user?.username || ''}
                disabled
                style={{ background: 'var(--bg-subtle)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address *</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Street address, building/apt, city, state, postal code"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              ></textarea>
              <span className="form-hint">Please ensure detailed address for carrier dispatch.</span>
            </div>

            {/* Shipping Option */}
            <div className="form-group" style={{ marginTop: '24px' }}>
              <label className="form-label">Shipping Method:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: shippingOption === 'STANDARD' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: shippingOption === 'STANDARD' ? 'var(--primary-light)' : '#fff',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name="shipping"
                      value="STANDARD"
                      checked={shippingOption === 'STANDARD'}
                      onChange={() => setShippingOption('STANDARD')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Standard Delivery</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated 3-5 business days</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800 }}>₹50.00</span>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: shippingOption === 'EXPRESS' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: shippingOption === 'EXPRESS' ? 'var(--primary-light)' : '#fff',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      name="shipping"
                      value="EXPRESS"
                      checked={shippingOption === 'EXPRESS'}
                      onChange={() => setShippingOption('EXPRESS')}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Express Priority</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated 1-2 business days</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 800 }}>₹120.00</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: '24px' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                <>
                  <CreditCard size={20} /> Pay with Razorpay (₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Review Card */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Items in Order ({cart.itemCount})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', maxHeight: '280px', overflowY: 'auto' }}>
            {cart.items.map((item) => {
              const pName = item.productName || item.product?.productName || item.product?.name || 'Product';
              const pImg = item.imageUrl || item.product?.imageUrls?.[0] || item.product?.images?.[0]?.imageUrl || item.product?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
              const itemTotal = Number(item.subtotal || item.itemTotal || (item.price * item.quantity) || 0);

              return (
                <div key={item.id || item.cartItemId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={pImg}
                      alt={pName}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{pName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{Number(cart.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping Charge</span>
              <span style={{ fontWeight: 600 }}>₹{shippingCost.toFixed(2)}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '2px solid var(--border-color)',
              paddingTop: '14px',
              fontSize: '1.25rem',
              fontWeight: 800
            }}>
              <span>Payable Amount</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
