import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import {
  Share2,
  Star,
  Tag,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Truck,
  ShieldCheck,
  Banknote,
  Award,
  Package,
  Lock,
  ShoppingCart,
  Zap,
  Heart,
  Check,
  AlertCircle,
  ArrowLeft,
  ZoomIn,
  Play
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeThumbIdx, setActiveThumbIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('4GB + 128GB');
  const [selectedColor, setSelectedColor] = useState('Vibe Violet');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
        if (data.imageUrls && data.imageUrls.length > 0) {
          setSelectedImage(data.imageUrls[0]);
        }
      } catch (err) {
        setErrorMsg('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Extract or detect Brand from title
  const titleWords = product.name.split(' ');
  const detectedBrand = titleWords[0] || 'Official Brand';

  // Generate thumbnail set (Images 2 & 3 show multiple views + video box + '+11' badge)
  const baseImg = (product.imageUrls && product.imageUrls.length > 0)
    ? product.imageUrls[0]
    : 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80';

  const galleryImages = product.imageUrls && product.imageUrls.length > 1
    ? product.imageUrls
    : [
        baseImg,
        baseImg,
        baseImg,
        baseImg,
      ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setAdding(true);
      setErrorMsg('');
      await addToCart(product.productId, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Could not add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await addToCart(product.productId, quantity);
      navigate('/checkout');
    } catch (err) {
      setErrorMsg(err.message || 'Could not proceed to checkout');
    }
  };

  const isOutOfStock = product.stock <= 0;
  const numPrice = Number(product.price) || 0;
  const emiMonth = Math.round(numPrice / 24);

  // Variant sizes based on category
  const isFashion = product.categoryName === 'Fashion';
  const sizeOptions = isFashion ? ['S', 'M', 'L', 'XL'] : ['4GB + 128GB', '6GB + 128GB', '8GB + 256GB'];

  // Tech Specs Mapping based on Image 3
  const isMobileOrElectronics = product.categoryName === 'Mobiles' || product.categoryName === 'Electronics';
  const techSpecs = isMobileOrElectronics ? [
    { label: 'Brand', value: detectedBrand },
    { label: 'Operating System', value: detectedBrand === 'Apple' ? 'iOS 17 / iPadOS' : 'Android 15.0 (6 Gen OS Upgrades)' },
    { label: 'RAM Memory Installed Size', value: selectedSize.includes('8GB') ? '8 GB' : selectedSize.includes('6GB') ? '6 GB' : '4 GB' },
    { label: 'CPU Model', value: detectedBrand === 'Samsung' ? 'Mediatek Dimensity 6300' : `${detectedBrand} High-Speed Octa-Core 5G` },
    { label: 'CPU Speed', value: '2.4 GHz' },
  ] : [
    { label: 'Brand', value: detectedBrand },
    { label: 'Category', value: product.categoryName },
    { label: 'Subcategory', value: product.subCategory || 'Standard Edition' },
    { label: 'Material / Build', value: isFashion ? '100% Breathable Fine Cotton Blend' : 'Commercial Grade Certified' },
    { label: 'Warranty Summary', value: '1 Year Brand Manufacturer Warranty' },
  ];

  // Dynamic Bullet Points for "About this item" (Matches Image 3)
  const bulletPoints = [
    `Segment Smoothest Performance - Engineered with verified specifications, high refresh dynamic display, and optimized thermal efficiency.`,
    `Segment Longest Battery & Power Optimization - High capacity cellular architecture with fast recharge protection for prolonged daily operation.`,
    `Segment Leading ${detectedBrand} Certified Architecture - Official genuine hardware directly sourced with verified warranty validation.`,
    `Knox & Hardware Security Suite - Industry standard safety compliance, verified Razorpay payment protection, and tamper-proof packaging.`,
    `Direct Quality Goods Curated for You - Genuine catalog unit with authentic specifications and immediate dispatch availability.`
  ];

  return (
    <div style={{ background: '#ffffff', minHeight: '90vh', padding: '16px 0 60px' }}>
      <div className="container" style={{ maxWidth: '1360px', padding: '0 20px' }}>
        
        {/* 1. Breadcrumb Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.82rem',
          color: '#565959',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{ color: '#007185', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} color="#888" />
          <Link to="/products" style={{ color: '#007185', textDecoration: 'none' }}>Catalog</Link>
          {product.categoryName && (
            <>
              <ChevronRight size={12} color="#888" />
              <span style={{ color: '#007185' }}>{product.categoryName}</span>
            </>
          )}
          {product.subCategory && (
            <>
              <ChevronRight size={12} color="#888" />
              <span style={{ color: '#565959', fontWeight: 600 }}>{product.subCategory}</span>
            </>
          )}
        </div>

        {/* 2. Main Product Showcase Grid (Matches Image 2 & 3) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 480px) 1fr',
          gap: '36px',
          alignItems: 'start'
        }}>

          {/* =========================================================================
              LEFT COLUMN: THUMBNAILS + LARGE PRODUCT IMAGE SHOWCASE (Matches Image 2)
             ========================================================================= */}
          <div style={{ display: 'flex', gap: '16px', position: 'sticky', top: '24px' }}>
            
            {/* Vertical Thumbnail Strip (Far Left) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '56px',
              flexShrink: 0
            }}>
              {galleryImages.slice(0, 4).map((url, idx) => {
                const isActive = activeThumbIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImage(url);
                      setActiveThumbIdx(idx);
                    }}
                    onMouseEnter={() => {
                      setSelectedImage(url);
                      setActiveThumbIdx(idx);
                    }}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '6px',
                      border: isActive ? '2px solid #007185' : '1px solid #d5d9d9',
                      background: '#ffffff',
                      padding: '3px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      boxShadow: isActive ? '0 0 4px rgba(0, 113, 133, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <img
                      src={url}
                      alt={`View ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </button>
                );
              })}

              {/* Video Preview Box (Matches Image 2) */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '6px',
                border: '1px solid #d5d9d9',
                background: '#0f172a',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '2px'
              }}
              title="Product Video Tour"
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px'
                }}>
                  <Play size={10} fill="#ffffff" color="#ffffff" style={{ marginLeft: '1px' }} />
                </div>
                <span style={{ fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1 }}>
                  5 Videos
                </span>
              </div>

              {/* Extra images '+11' Badge (Matches Image 2) */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '6px',
                border: '1px solid #d5d9d9',
                background: '#f8fafc',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
              title="View all 11+ high-resolution product photos"
              >
                11+
              </div>
            </div>

            {/* Main Product Image Stage (No Cropping, Clean Contain) */}
            <div style={{
              flex: 1,
              background: '#ffffff',
              border: '1px solid #e7e7e7',
              borderRadius: '8px',
              padding: '20px 16px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: '480px'
            }}>
              {/* Share Icon in Top-Right (Matches Image 2) */}
              <button
                onClick={handleShare}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: '1px solid #d5d9d9',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#565959',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  transition: 'background 0.15s ease'
                }}
                title="Share this product link"
              >
                <Share2 size={16} />
              </button>

              {copiedLink && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  right: '12px',
                  background: '#0f172a',
                  color: '#fff',
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  zIndex: 20
                }}>
                  Link copied!
                </div>
              )}

              {/* The Genuine Uncropped Product Image */}
              <div style={{
                width: '100%',
                height: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px 0'
              }}>
                <img
                  src={selectedImage || baseImg}
                  alt={product.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {/* Bottom "Click to see full view" (Matches Image 3) */}
              <div style={{
                marginTop: '12px',
                fontSize: '0.82rem',
                color: '#007185',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}>
                <ZoomIn size={14} /> Click to see full view
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: AMAZON/FLIPKART STYLE COMMERCIAL SPECS (Matches Image 2 & 3)
             ========================================================================= */}
          <div>
            {/* Title */}
            <h1 style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#0f1111',
              lineHeight: 1.35,
              margin: '0 0 6px 0',
              letterSpacing: '-0.3px'
            }}>
              {product.name}
            </h1>

            {/* Brand Store Link */}
            <div style={{ marginBottom: '8px' }}>
              <a href="#store" style={{ color: '#007185', fontSize: '0.86rem', fontWeight: 600, textDecoration: 'none' }}>
                Visit the {detectedBrand} Store
              </a>
            </div>

            {/* Ratings & Social Proof (Matches Image 2) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.86rem',
              color: '#565959',
              marginBottom: '14px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#de7921', fontWeight: 700 }}>
                <span>3.9</span>
                <div style={{ display: 'flex', color: '#de7921' }}>
                  <Star size={15} fill="#de7921" />
                  <Star size={15} fill="#de7921" />
                  <Star size={15} fill="#de7921" />
                  <Star size={15} fill="#de7921" />
                  <Star size={15} color="#de7921" />
                </div>
              </div>
              <span style={{ color: '#007185', cursor: 'pointer' }}>(1,138 ratings)</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <span style={{ fontWeight: 600, color: '#334155' }}>500+ bought in past month</span>
            </div>

            {/* Horizontal Line */}
            <div style={{ height: '1px', background: '#e7e7e7', margin: '14px 0' }} />

            {/* Price Row (Matches Image 2) */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2px', color: '#0f1111' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px' }}>₹</span>
                <span style={{ fontSize: '2.1rem', fontWeight: 700, lineHeight: 1 }}>
                  {numPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#565959', marginTop: '4px' }}>
                Inclusive of all taxes
              </div>
              <div style={{
                fontSize: '0.86rem',
                color: '#0f1111',
                marginTop: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span><strong>EMI</strong> starts at ₹{emiMonth}. No Cost EMI available</span>
                <span style={{ color: '#007185', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                  EMI options <ChevronDown size={14} />
                </span>
              </div>
            </div>

            {/* Offers Carousel / Cards Box (Matches Image 2) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#0f1111',
                marginBottom: '10px'
              }}>
                <Tag size={16} color="#c2410c" /> Offers
              </div>

              {/* 4 Commercial Offer Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '10px'
              }}>
                {/* 1. Cashback */}
                <div style={{
                  border: '1px solid #d5d9d9',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f1111', marginBottom: '4px' }}>
                    Cashback
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#334155', lineHeight: 1.35, marginBottom: '8px' }}>
                    Upto ₹599.00 cashback on balance when using Razorpay
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#007185', fontWeight: 600, cursor: 'pointer' }}>
                    1 offer &gt;
                  </div>
                </div>

                {/* 2. No Cost EMI */}
                <div style={{
                  border: '1px solid #d5d9d9',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f1111', marginBottom: '4px' }}>
                    No Cost EMI
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#334155', lineHeight: 1.35, marginBottom: '8px' }}>
                    Upto ₹521.38 EMI interest savings on major bank cards
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#007185', fontWeight: 600, cursor: 'pointer' }}>
                    1 offer &gt;
                  </div>
                </div>

                {/* 3. Bank Offer */}
                <div style={{
                  border: '1px solid #d5d9d9',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f1111', marginBottom: '4px' }}>
                    Bank Offer
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#334155', lineHeight: 1.35, marginBottom: '8px' }}>
                    Upto ₹600.00 discount on HDFC/ICICI Credit Cards
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#007185', fontWeight: 600, cursor: 'pointer' }}>
                    5 offers &gt;
                  </div>
                </div>

                {/* 4. Partner Offers */}
                <div style={{
                  border: '1px solid #d5d9d9',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f1111', marginBottom: '4px' }}>
                    Partner Offers
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#334155', lineHeight: 1.35, marginBottom: '8px' }}>
                    Get GST invoice and save up to 18% on business purchase
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#007185', fontWeight: 600, cursor: 'pointer' }}>
                    1 offer &gt;
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Trust Badges (Exact replica from Image 2) */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              overflowX: 'auto',
              padding: '12px 0 16px',
              borderTop: '1px solid #e7e7e7',
              borderBottom: '1px solid #e7e7e7',
              marginBottom: '20px'
            }}>
              {[
                { icon: RotateCcw, text: '10 days Service Centre Replacement' },
                { icon: Truck, text: 'Free Delivery' },
                { icon: ShieldCheck, text: '12 Month Warranty' },
                { icon: Banknote, text: 'Pay on Delivery' },
                { icon: Award, text: 'Top Brand' },
                { icon: Package, text: 'SalesSavvy Delivered' },
                { icon: Lock, text: 'Secure transaction' },
              ].map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      width: '78px',
                      flexShrink: 0
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#007185',
                      marginBottom: '6px'
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontSize: '0.68rem', color: '#007185', lineHeight: 1.25, fontWeight: 500 }}>
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Variants: Size Selector (Image 3) */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f1111', marginBottom: '8px' }}>
                Size: <span style={{ fontWeight: 400 }}>{selectedSize}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizeOptions.map((opt) => {
                  const isSel = selectedSize === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSelectedSize(opt)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        border: isSel ? '2px solid #007185' : '1px solid #d5d9d9',
                        background: isSel ? '#edfdff' : '#ffffff',
                        fontSize: '0.84rem',
                        fontWeight: isSel ? 700 : 500,
                        color: isSel ? '#007185' : '#0f1111',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Variants: Colour Swatches (Image 3) */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f1111', marginBottom: '8px' }}>
                Colour: <span style={{ fontWeight: 400 }}>{selectedColor}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Vibe Violet', 'Sky Blue'].map((col, idx) => {
                  const isSel = selectedColor === col;
                  return (
                    <div
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      style={{
                        border: isSel ? '2px solid #007185' : '1px solid #d5d9d9',
                        borderRadius: '6px',
                        padding: '4px',
                        background: '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'center',
                        width: '74px'
                      }}
                    >
                      <div style={{ width: '100%', height: '54px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={galleryImages[idx] || baseImg}
                          alt={col}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#0f1111', display: 'block', marginTop: '2px', fontWeight: 600 }}>
                        ₹{numPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Style Name */}
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f1111', marginBottom: '16px' }}>
              Style Name: <span style={{ fontWeight: 400 }}>2025 Edition</span>
            </div>

            {/* Technical Specifications Table (Matches Image 3) */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '170px 1fr',
                gap: '8px 16px',
                fontSize: '0.86rem',
                lineHeight: 1.45
              }}>
                {techSpecs.map((spec, idx) => (
                  <React.Fragment key={idx}>
                    <div style={{ fontWeight: 700, color: '#0f1111' }}>{spec.label}</div>
                    <div style={{ color: '#334155' }}>{spec.value}</div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* "About this item" Bullet Points (Matches Image 3) */}
            <div style={{
              borderTop: '1px solid #e7e7e7',
              paddingTop: '18px',
              marginBottom: '28px'
            }}>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#0f1111',
                marginBottom: '10px'
              }}>
                About this item
              </h3>

              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.88rem',
                color: '#334155',
                lineHeight: 1.5
              }}>
                {bulletPoints.map((pt, idx) => {
                  const parts = pt.split(' - ');
                  return (
                    <li key={idx}>
                      {parts.length > 1 ? (
                        <>
                          <strong style={{ color: '#0f1111' }}>{parts[0]}</strong> - {parts.slice(1).join(' - ')}
                        </>
                      ) : (
                        pt
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* =========================================================================
                ACTION / BUY / ADD TO CART BOX
               ========================================================================= */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '20px',
              maxWidth: '420px'
            }}>
              {/* Stock Status */}
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: isOutOfStock ? '#dc2626' : '#007600',
                marginBottom: '12px'
              }}>
                {isOutOfStock ? 'Currently unavailable' : 'In stock'}
              </div>

              {!isOutOfStock && (
                <div style={{ fontSize: '0.84rem', color: '#565959', marginBottom: '14px' }}>
                  Ships from <strong>SalesSavvy Fulfillment</strong> and sold by <strong>Verified Retail Seller</strong>.
                </div>
              )}

              {/* Quantity Selector */}
              {!isAdmin && !isOutOfStock && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <label style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f1111' }}>Quantity:</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #d5d9d9',
                      background: '#f0f2f2',
                      fontSize: '0.86rem',
                      fontWeight: 600
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              )}

              {errorMsg && (
                <div style={{
                  fontSize: '0.82rem',
                  color: '#dc2626',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={15} /> {errorMsg}
                </div>
              )}

              {/* Commercial Action Buttons */}
              {!isAdmin && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Add to Cart (Amazon Yellow Pill Button) */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || adding}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '999px',
                      background: '#ffd814',
                      border: '1px solid #fcd200',
                      color: '#0f1111',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 5px rgba(213, 217, 217, 0.5)',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {added ? (
                      <>
                        <Check size={18} color="#15803d" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> Add to Cart
                      </>
                    )}
                  </button>

                  {/* Buy Now (Amazon Orange Pill Button) */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '999px',
                      background: '#ffa41c',
                      border: '1px solid #ff8f00',
                      color: '#0f1111',
                      fontWeight: 700,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 2px 5px rgba(213, 217, 217, 0.5)'
                    }}
                  >
                    <Zap size={18} /> Buy Now
                  </button>
                </div>
              )}

              {/* Secure Transaction Guarantee */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: '#565959',
                marginTop: '16px'
              }}>
                <Lock size={14} color="#007185" /> Secure transaction with Razorpay protection
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
