import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Tag,
  Zap,
  PlusCircle,
  CreditCard,
  MapPin,
  Heart,
  Gift,
  Bell,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountDropdown = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'coupons', 'supercoin', 'plus', 'wallet', 'addresses', 'notifications'
  const [copiedCode, setCopiedCode] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2500);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Account Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="account-trigger-btn"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--text-main)',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1.5px solid #2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#2563eb'
        }}>
          <User size={18} />
        </div>
        <span>{isAuthenticated && user?.username ? user.username : 'Account'}</span>
        {isOpen ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>

      {/* Account Dropdown Popover matching 4th image */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            width: '280px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e2e8f0',
            padding: '16px 0',
            zIndex: 1000,
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {/* Header */}
          <div style={{ padding: '0 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Your Account
            </h3>
            {isAuthenticated ? (
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                Signed in as <strong style={{ color: '#2563eb' }}>{user?.username}</strong>
              </p>
            ) : (
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                <Link to="/login" style={{ color: '#2563eb', fontWeight: 600 }}>Sign in</Link> to access your perks
              </p>
            )}
          </div>

          {/* Menu Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 0' }}>
            {/* 1. My Profile */}
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="account-menu-item"
            >
              <User size={18} color="#334155" />
              <span>My Profile</span>
            </Link>

            {/* 2. Orders */}
            <Link
              to="/orders"
              onClick={() => setIsOpen(false)}
              className="account-menu-item"
            >
              <Package size={18} color="#334155" />
              <span>Orders</span>
            </Link>

            {/* 3. Coupons */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('coupons');
              }}
              className="account-menu-item"
            >
              <Tag size={18} color="#334155" />
              <span>Coupons</span>
              <span className="badge-pill" style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.7rem' }}>3 New</span>
            </button>

            {/* 4. Supercoin */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('supercoin');
              }}
              className="account-menu-item"
            >
              <Zap size={18} color="#eab308" />
              <span>Supercoin</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ca8a04', background: '#fef9c3', padding: '2px 8px', borderRadius: '12px' }}>
                ⚡ 250
              </span>
            </button>

            {/* 5. Flipkart / Savvy Plus Zone */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('plus');
              }}
              className="account-menu-item"
            >
              <PlusCircle size={18} color="#2563eb" />
              <span>Flipkart Plus Zone</span>
            </button>

            {/* 6. Saved Cards & Wallet */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('wallet');
              }}
              className="account-menu-item"
            >
              <CreditCard size={18} color="#334155" />
              <span>Saved Cards & Wallet</span>
            </button>

            {/* 7. Saved Addresses */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('addresses');
              }}
              className="account-menu-item"
            >
              <MapPin size={18} color="#334155" />
              <span>Saved Addresses</span>
            </button>

            {/* 8. Wishlist */}
            <Link
              to="/products"
              onClick={() => setIsOpen(false)}
              className="account-menu-item"
            >
              <Heart size={18} color="#334155" />
              <span>Wishlist</span>
            </Link>

            {/* 9. Gift Cards */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('giftcards');
              }}
              className="account-menu-item"
            >
              <Gift size={18} color="#334155" />
              <span>Gift Cards</span>
            </button>

            {/* 10. Notifications */}
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveModal('notifications');
              }}
              className="account-menu-item"
            >
              <Bell size={18} color="#334155" />
              <span>Notifications</span>
            </button>

            {/* 11. Logout */}
            {isAuthenticated && (
              <>
                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '6px 0' }} />
                <button
                  onClick={handleLogout}
                  className="account-menu-item"
                  style={{ color: '#ef4444' }}
                >
                  <LogOut size={18} color="#ef4444" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Interactive Account Feature Modals */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <button
              onClick={() => setActiveModal(null)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '20px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={18} />
            </button>

            {/* Coupons Modal */}
            {activeModal === 'coupons' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Tag size={24} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Available Coupons</h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
                  Apply these verified promo codes at checkout for exclusive SMB savings.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { code: 'SAVVY10', discount: '10% OFF', desc: 'Flat 10% discount on orders over ₹1,999' },
                    { code: 'FESTIVE500', discount: '₹500 OFF', desc: 'Flat ₹500 off on tech & fashion above ₹4,999' },
                    { code: 'FREESHIP', discount: 'FREE EXPRESS', desc: 'Free express shipping on all orders over ₹999' },
                  ].map((coupon) => (
                    <div key={coupon.code} style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '12px',
                      padding: '14px',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b', letterSpacing: '0.5px' }}>{coupon.code}</span>
                          <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                            {coupon.discount}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>{coupon.desc}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 12px', gap: '6px' }}
                      >
                        {copiedCode === coupon.code ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                        {copiedCode === coupon.code ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Supercoin Modal */}
            {activeModal === 'supercoin' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#fef9c3',
                    color: '#ca8a04',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}>
                    <Zap size={36} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Supercoin Balance</h3>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ca8a04', marginTop: '8px' }}>
                    250 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>Coins</span>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem', fontWeight: 700 }}>Supercoin Privileges:</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                    <li>1 Supercoin = ₹1 redemption value on orders</li>
                    <li>Exclusive access to early festive deals</li>
                    <li>Complimentary Express Delivery voucher after 500 coins</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Plus Zone Modal */}
            {activeModal === 'plus' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <PlusCircle size={28} color="#2563eb" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Flipkart / Savvy Plus</h3>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: '#fff', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '20px' }}>
                    VIP Membership Active
                  </span>
                  <h4 style={{ fontSize: '1.3rem', margin: '12px 0 6px', fontWeight: 800 }}>Plus Member Benefits</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>Enjoy 2x Supercoins on every verified Razorpay purchase and priority courier dispatch.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>Free Delivery</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No minimum order constraint</span>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <strong style={{ fontSize: '0.88rem', display: 'block', marginBottom: '4px' }}>Early Access</strong>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>24h before public sales</span>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Cards & Wallet Modal */}
            {activeModal === 'wallet' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <CreditCard size={24} color="#0f172a" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Saved Cards & Wallet</h3>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Available Savvy Wallet Balance</span>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>₹1,500.00</div>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>✓ Instant 1-click Razorpay checkout</span>
                </div>
                <h4 style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '10px' }}>Saved Payment Methods:</h4>
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={20} color="#2563eb" />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>HDFC Bank Credit Card</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ending in **** 8421</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>Verified</span>
                </div>
              </div>
            )}

            {/* Saved Addresses Modal */}
            {activeModal === 'addresses' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <MapPin size={24} color="#0f172a" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Saved Addresses</h3>
                </div>
                <div style={{ border: '1.5px solid #2563eb', borderRadius: '12px', padding: '16px', background: '#eff6ff', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>{user?.username || 'Customer'} (Home)</span>
                    <span style={{ fontSize: '0.72rem', background: '#2563eb', color: '#fff', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Default</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                    Flat 402, Sunshine Heights, MG Road, Koramangala<br />
                    Bengaluru, Karnataka - 560034<br />
                    Phone: +91 98765 43210
                  </p>
                </div>
              </div>
            )}

            {/* Notifications Modal */}
            {activeModal === 'notifications' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Bell size={24} color="#0f172a" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Notifications</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #059669' }}>
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: '#0f172a' }}>Order Dispatched via Express</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Your latest package is out for delivery. Real-time tracking enabled.</p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', borderLeft: '4px solid #2563eb' }}>
                    <strong style={{ fontSize: '0.85rem', display: 'block', color: '#0f172a' }}>Big Billion SMB Sale Live!</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#64748b' }}>Explore 50+ newly listed electronics and fashion genuine items.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Gift Cards Modal */}
            {activeModal === 'giftcards' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <Gift size={24} color="#0f172a" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Sales Savvy Gift Cards</h3>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #1d1d1f 0%, #2c2c2e 100%)', color: '#fff', borderRadius: '16px', padding: '22px', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.5px' }}>APPLE-GRADE E-GIFT VOUCHER</span>
                    <Gift size={22} color="#0071e3" />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, margin: '14px 0 6px' }}>₹2,000.00</div>
                  <span style={{ fontSize: '0.78rem', opacity: 0.9 }}>Card: **** **** **** 9102</span>
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Add a New Gift Card</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="form-control" placeholder="Enter 16-digit voucher pin" />
                    <button className="btn btn-primary btn-sm">Apply</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
