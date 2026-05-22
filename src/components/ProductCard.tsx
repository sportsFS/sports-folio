import { useState } from 'react';
import { Product } from '../data/products';
import { useApp } from '../context/AppContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart, showToast } = useApp();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const stars = '★'.repeat(Math.floor(product.rating));

  function handleAddToCart() {
    addToCart(product);
    showToast(product.name, 'Added to your cart successfully!');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const categoryLabel: Record<string, string> = {
    bats: 'Cricket Bats',
    balls: 'Cricket Balls',
    protection: 'Protective Gear',
    footwear: 'Footwear',
    accessories: 'Accessories',
  };

  return (
    <div className="product-card reveal visible">
      {/* Badge */}
      {product.badge && (
        <div style={{
          position: 'absolute', top: 16, left: 16,
          padding: '6px 14px',
          background: product.badgeClass === 'hot' ? '#FF3333' : 'var(--neon)',
          color: product.badgeClass === 'hot' ? 'white' : 'var(--black)',
          fontWeight: 700, fontSize: '0.75rem',
          borderRadius: 50, zIndex: 5,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setWishlisted(w => !w)}
        className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
        style={{
          position: 'absolute', top: 16, right: 16,
          width: 38, height: 38,
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 5,
          fontSize: '1rem',
        }}
      >
        {wishlisted ? '❤️' : '♡'}
      </button>

      {/* Image */}
      <div style={{
        width: '100%', height: 240,
        background: 'var(--section-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.4s ease',
      }}>
        <span className="card-image-inner" style={{ fontSize: '5rem' }}>{product.emoji}</span>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(transparent, var(--card-bg))',
        }} />
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--neon-dark)',
          fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 1, marginBottom: 8,
        }}>
          {categoryLabel[product.category] || product.category}
        </div>
        <h3 style={{
          fontSize: '1.05rem', fontWeight: 700,
          marginBottom: 8, lineHeight: 1.4,
          color: 'var(--text)',
        }}>
          {product.name}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.85rem' }}>
          <span style={{ color: '#FFD700', letterSpacing: 2 }}>{stars}</span>
          <span style={{ color: 'var(--text)' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({product.reviews})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>
              ${product.price.toLocaleString('en-US')}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginLeft: 8 }}>
              ${product.oldPrice.toLocaleString('en-US')}
            </span>
          </div>
          <span style={{ color: 'var(--neon-dark)', fontWeight: 700, fontSize: '0.85rem' }}>{discount}% OFF</span>
        </div>
        <button className={`card-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart}>
          {added ? '✓ ADDED' : '🛒 ADD TO CART'}
        </button>
      </div>
    </div>
  );
}
