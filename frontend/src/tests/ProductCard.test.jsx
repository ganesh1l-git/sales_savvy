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
    expect(screen.getByText('25 in stock')).toBeDefined();
    expect(screen.getByText(/3,499\.00/)).toBeDefined();
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

    expect(screen.getByText('Out of Stock')).toBeDefined();
    const btn = screen.getByRole('button');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});
