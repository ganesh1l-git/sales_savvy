import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

describe('ProductCard Component', () => {
  const mockProduct = {
    productId: 1,
    name: 'SavvySound Pro ANC Headphones',
    description: 'Noise cancelling over-ear headphones',
    price: 3499.00,
    stock: 25,
    categoryName: 'Electronics',
    imageUrls: ['https://example.com/headphones.jpg']
  };

  it('renders product information correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={mockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('SavvySound Pro ANC Headphones')).toBeDefined();
    expect(screen.getByText('Electronics')).toBeDefined();
    expect(screen.getByText('In Stock')).toBeDefined();
    expect(screen.getByText(/3,499/)).toBeDefined();
  });

  it('displays out of stock badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={outOfStockProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    const outOfStockElements = screen.getAllByText('Out of Stock');
    expect(outOfStockElements.length).toBeGreaterThan(0);
    const btn = screen.getByRole('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });

  it('renders correctly with Supabase-shaped product (productName, category object, images array)', () => {
    const supabaseProduct = {
      productId: 22,
      productName: 'Biba Women Cotton Straight Printed Kurta Set with Palazzo & Dupatta',
      description: 'Pure cotton ethnic kurta set',
      price: 2499.00,
      stockQuantity: 40,
      subCategory: 'Kurta sets',
      category: {
        categoryId: 1,
        categoryName: 'Fashion'
      },
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800' }]
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <ProductCard product={supabaseProduct} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('Biba Women Cotton Straight Printed Kurta Set with Palazzo & Dupatta')).toBeDefined();
    expect(screen.getByText('Fashion')).toBeDefined();
    expect(screen.getByText('Kurta sets')).toBeDefined();
    expect(screen.getByText('In Stock')).toBeDefined();
    expect(screen.getByText(/2,499/)).toBeDefined();
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800');
  });
});
