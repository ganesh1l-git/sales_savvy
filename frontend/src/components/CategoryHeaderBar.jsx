import React from 'react';
import {
  ShoppingBag,
  Shirt,
  Smartphone,
  Laptop,
  Sparkles,
  Lamp,
  Tv,
  Baby,
  HeartPulse,
  HardHat,
  Trophy,
  Armchair,
  BookOpen,
  Bike
} from 'lucide-react';

export const CategoryHeaderBar = ({
  selectedCategory,
  onSelectCategory,
  selectedSubCategory,
  onSelectSubCategory
}) => {
  // Top Categories (Image 1)
  const topCategories = [
    { id: 'all', name: 'For You', icon: ShoppingBag },
    { id: 'fashion', name: 'Fashion', icon: Shirt, categoryName: 'Fashion' },
    { id: 'mobiles', name: 'Mobiles', icon: Smartphone, categoryName: 'Mobiles' },
    { id: 'electronics', name: 'Electronics', icon: Laptop, categoryName: 'Electronics' },
    { id: 'beauty', name: 'Beauty', icon: Sparkles, categoryName: 'Beauty' },
    { id: 'home', name: 'Home', icon: Lamp, categoryName: 'Home' },
    { id: 'appliances', name: 'Appliances', icon: Tv, categoryName: 'Appliances' },
    { id: 'toys', name: 'Toys, baby...', icon: Baby, categoryName: 'Toys, baby' },
    { id: 'food', name: 'Food & Health', icon: HeartPulse, categoryName: 'Food & Health' },
    { id: 'auto', name: 'Auto Accessories', icon: HardHat, categoryName: 'Auto Accessories' },
    { id: 'sports', name: 'Sports & Fitness', icon: Trophy, categoryName: 'Sports & Fitness' },
    { id: 'furniture', name: 'Furniture', icon: Armchair, categoryName: 'Furniture' },
    { id: 'books', name: 'Books', icon: BookOpen, categoryName: 'Books' },
    { id: 'two-wheelers', name: '2 Wheelers', icon: Bike, categoryName: '2 Wheelers' },
  ];

  // Comprehensive Subcategories for ALL 13 Departments
  // Every subcategory contains at least 20-25 genuine products seeded from real Indian commercial catalogs
  const subcategoriesMap = {
    'Fashion': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Kurta sets', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80' },
      { name: 'Dresses', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200&auto=format&fit=crop&q=80' },
      { name: 'Shirts & Tees', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80' },
      { name: 'Jeans', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80' },
      { name: 'Shoes', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
      { name: 'Watches', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&auto=format&fit=crop&q=80' },
    ],
    'Mobiles': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Flagship 5G', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&auto=format&fit=crop&q=80' },
      { name: 'Budget 5G', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=80' },
      { name: 'Mobile Covers', img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=200&auto=format&fit=crop&q=80' },
      { name: 'Chargers & Cables', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80' },
    ],
    'Electronics': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Laptops', img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&auto=format&fit=crop&q=80' },
      { name: 'Tablets', img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&auto=format&fit=crop&q=80' },
      { name: 'Earphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80' },
      { name: 'Wearables', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
      { name: 'Power Bank', img: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&auto=format&fit=crop&q=80' },
      { name: 'Speakers', img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=200&auto=format&fit=crop&q=80' },
    ],
    'Beauty': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Skincare', img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=80' },
      { name: 'Haircare', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=200&auto=format&fit=crop&q=80' },
      { name: 'Fragrances', img: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=200&auto=format&fit=crop&q=80' },
      { name: "Men's Grooming", img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&auto=format&fit=crop&q=80' },
    ],
    'Home': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Cookware & Kitchen', img: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200&auto=format&fit=crop&q=80' },
      { name: 'Bedsheets & Linen', img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200&auto=format&fit=crop&q=80' },
      { name: 'Home Decor & Lighting', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&auto=format&fit=crop&q=80' },
    ],
    'Appliances': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Kitchen Appliances', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=200&auto=format&fit=crop&q=80' },
      { name: 'Home Comfort & Cooling', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&auto=format&fit=crop&q=80' },
      { name: 'Microwaves & Ovens', img: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&auto=format&fit=crop&q=80' },
    ],
    'Toys, baby': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Baby Care & Diapers', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200&auto=format&fit=crop&q=80' },
      { name: 'Educational & Board Games', img: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200&auto=format&fit=crop&q=80' },
      { name: 'Action Figures & Toys', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=200&auto=format&fit=crop&q=80' },
    ],
    'Food & Health': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Supplements & Protein', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&auto=format&fit=crop&q=80' },
      { name: 'Dry Fruits & Nuts', img: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=200&auto=format&fit=crop&q=80' },
      { name: 'Healthy Snacks & Teas', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=200&auto=format&fit=crop&q=80' },
    ],
    'Auto Accessories': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Riding Gear & Helmets', img: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&auto=format&fit=crop&q=80' },
      { name: 'Car Utilities & Care', img: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=200&auto=format&fit=crop&q=80' },
      { name: 'Dash Cameras & Pumps', img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=200&auto=format&fit=crop&q=80' },
    ],
    'Sports & Fitness': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Fitness Equipment', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=200&auto=format&fit=crop&q=80' },
      { name: 'Outdoor & Racquet Sports', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=200&auto=format&fit=crop&q=80' },
      { name: 'Yoga & Exercise Mats', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&auto=format&fit=crop&q=80' },
    ],
    'Furniture': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Chairs & Desks', img: 'https://images.unsplash.com/photo-1580481077195-c32406856013?w=200&auto=format&fit=crop&q=80' },
      { name: 'Living & Bedroom', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&auto=format&fit=crop&q=80' },
      { name: 'Beds & Mattresses', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop&q=80' },
    ],
    'Books': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Fiction & Best Sellers', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200&auto=format&fit=crop&q=80' },
      { name: 'Self-Help & Business', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=200&auto=format&fit=crop&q=80' },
      { name: 'Academic & Exam Prep', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&auto=format&fit=crop&q=80' },
    ],
    '2 Wheelers': [
      { name: 'Top-50', img: '', isBadge: true },
      { name: 'Electric Scooters & Gear', img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=200&auto=format&fit=crop&q=80' },
      { name: 'Bike Care & Security', img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&auto=format&fit=crop&q=80' },
      { name: 'Riding Accessories', img: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=200&auto=format&fit=crop&q=80' },
    ]
  };

  // Determine current subcategories list
  const currentSubcategories = (selectedCategory && selectedCategory !== 'all')
    ? (subcategoriesMap[selectedCategory] || [])
    : [];

  return (
    <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* 1. TOP CATEGORY BAR (Matches 1st Image) */}
      <div className="container" style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          overflowX: 'auto',
          padding: '14px 4px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          whiteSpace: 'nowrap'
        }}>
          {topCategories.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all')) ||
              (cat.categoryName && (selectedCategory === cat.categoryName || selectedCategory === cat.id));

            return (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.categoryName || 'all');
                  if (onSelectSubCategory) onSelectSubCategory(null);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px 6px 10px',
                  color: isSelected ? 'var(--primary)' : '#424242',
                  position: 'relative',
                  transition: 'all 0.18s ease',
                  flexShrink: 0
                }}
              >
                {/* Accent Icon Background */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: isSelected ? 'var(--primary-light)' : '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isSelected ? 'var(--primary)' : '#333333',
                  transition: 'all 0.18s ease',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid #e8e8e8'
                }}>
                  <Icon size={20} />
                </div>
                <span style={{
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 500
                }}>
                  {cat.name}
                </span>

                {/* Active Underline Indicator */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '8%',
                    right: '8%',
                    height: '2.5px',
                    background: 'var(--primary)',
                    borderRadius: '2px'
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-CATEGORIES SECTION (Matches 2nd & 3rd Image) */}
      {selectedCategory !== 'all' && currentSubcategories.length > 0 && (
        <div style={{
          background: '#fdfbf7',
          borderTop: '1px solid #f1f5f9',
          padding: '24px 0 28px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div className="container" style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>
                  Explore {selectedCategory} Subcategories
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  Tap any subcategory to filter genuine items with real-time stock
                </p>
              </div>

              {selectedSubCategory && (
                <button
                  onClick={() => onSelectSubCategory(null)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  Clear Subcategory ✕
                </button>
              )}
            </div>

            {/* Subcategories Horizontal Grid */}
            <div style={{
              display: 'flex',
              gap: '14px',
              overflowX: 'auto',
              paddingBottom: '10px',
              scrollbarWidth: 'thin'
            }}>
              {currentSubcategories.map((item) => {
                const isSubSelected = selectedSubCategory === item.name;

                return (
                  <div
                    key={item.name}
                    onClick={() => {
                      if (item.isBadge) {
                        // Badge clears or selects top items
                        onSelectSubCategory(null);
                      } else {
                        onSelectSubCategory(isSubSelected ? null : item.name);
                      }
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      flexShrink: 0,
                      width: '92px',
                      transition: 'transform 0.18s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {/* Rounded cream card with bottom yellow bar (Matches 2nd & 3rd images) */}
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '16px',
                      background: item.isBadge ? 'linear-gradient(135deg, #2874f0 0%, #00b4db 100%)' : '#fef9ee',
                      borderTop: isSubSelected ? '2px solid var(--primary)' : '1px solid #fef08a',
                      borderLeft: isSubSelected ? '2px solid var(--primary)' : '1px solid #fef08a',
                      borderRight: isSubSelected ? '2px solid var(--primary)' : '1px solid #fef08a',
                      borderBottom: '4.5px solid #eab308',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSubSelected ? '0 4px 14px rgba(40, 116, 240, 0.25)' : '0 2px 6px rgba(0,0,0,0.04)',
                      position: 'relative'
                    }}>
                      {item.isBadge ? (
                        <div style={{
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          textAlign: 'center',
                          lineHeight: 1.1,
                          padding: '6px'
                        }}>
                          TOP 50<br /><span style={{ color: '#fef08a', fontSize: '0.82rem' }}>DEALS</span>
                        </div>
                      ) : (
                        <img
                          src={item.img}
                          alt={item.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          loading="lazy"
                        />
                      )}
                    </div>

                    {/* Label below card */}
                    <span style={{
                      marginTop: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isSubSelected ? 700 : 500,
                      color: isSubSelected ? 'var(--primary)' : '#212121',
                      textAlign: 'center',
                      lineHeight: 1.2,
                      maxWidth: '90px'
                    }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
