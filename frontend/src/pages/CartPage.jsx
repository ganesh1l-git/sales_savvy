import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const [shippingOption, setShippingOption] = useState('STANDARD');
  const navigate = useNavigate();

  const shippingCost = shippingOption === 'EXPRESS' ? 120 : 50;
  const grandTotal = Number(cart.subtotal || 0) + shippingCost;

  const handleProceedToCheckout = () => {
    navigate('/checkout', { state: { shippingOption } });
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 24px', minHeight: '70vh', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          padding: '24px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          marginBottom: '24px'
        }}>
          <ShoppingBag size={48} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 28px' }}>
          Explore our quality SMB merchandise and add products to start your order.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Browse Products <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Shopping Cart
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Review your selected items ({cart.itemCount} units)
          </p>
        </div>

        <button
          onClick={clearCart}
          className="btn btn-secondary btn-sm"
          style={{ color: 'var(--danger)' }}
        >
          <Trash2 size={16} /> Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        {/* Cart Items List */}
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
                  const pId = item.productId || item.product?.productId;
                  const pName = item.productName || item.product?.productName || item.product?.name || `Product #${pId || ''}`;
                  const pImg = item.imageUrl || item.product?.imageUrls?.[0] || item.product?.images?.[0]?.imageUrl || item.product?.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                  const pStock = item.availableStock !== undefined ? item.availableStock : (item.product?.stock !== undefined ? item.product?.stock : (item.product?.stockQuantity !== undefined ? item.product?.stockQuantity : 10));

                  return (
                    <tr key={item.id || item.cartItemId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={pImg}
                            alt={pName}
                            style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                          />
                          <div>
                            <Link to={`/products/${pId}`} style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                              {pName}
                            </Link>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                              Available: {pStock}
                            </div>
                          </div>
                        </div>
                      </td>

                    <td style={{ fontWeight: 600 }}>
                      ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        background: '#fff'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ padding: '0 10px', fontSize: '0.9rem', fontWeight: 700 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.availableStock}
                          style={{ padding: '4px 8px', color: 'var(--text-main)' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </td>

                    <td style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                      ₹{Number(item.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td>
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{ color: 'var(--danger)', padding: '6px' }}
                        title="Remove Item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary & Shipping Selection */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
            Order Summary
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
            <span style={{ fontWeight: 700 }}>
              ₹{Number(cart.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Shipping Option */}
          <div style={{ margin: '16px 0', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>Select Shipping Method:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: shippingOption === 'STANDARD' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: shippingOption === 'STANDARD' ? 'var(--primary-light)' : '#fff',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="STANDARD"
                    checked={shippingOption === 'STANDARD'}
                    onChange={() => setShippingOption('STANDARD')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Standard Delivery</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹50.00</span>
              </label>

              <label style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: shippingOption === 'EXPRESS' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: shippingOption === 'EXPRESS' ? 'var(--primary-light)' : '#fff',
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="radio"
                    name="shipping"
                    value="EXPRESS"
                    checked={shippingOption === 'EXPRESS'}
                    onChange={() => setShippingOption('EXPRESS')}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Express Priority</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>₹120.00</span>
              </label>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px 0 24px',
            paddingTop: '16px',
            borderTop: '2px solid var(--border-color)',
            fontSize: '1.25rem',
            fontWeight: 800
          }}>
            <span>Total Amount</span>
            <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="btn btn-primary btn-block btn-lg"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '16px' }}>
            <ShieldCheck size={16} color="var(--success)" /> 256-Bit Razorpay Encrypted Checkout
          </div>
        </div>
      </div>
    </div>
  );
};
