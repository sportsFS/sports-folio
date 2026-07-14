import { useState } from 'react';
import { Product } from '../data/products';
import { useApp } from '../context/AppContext';
import { findSuggestedAddOns, getProductCategoryLabel } from '../data/catalog';
import ProductQuickView from './ProductQuickView';

interface Props {
  product: Product;
}

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'code',
});

export default function ProductCard({ product }: Props) {
  const { addToCart, showToast, isLoggedIn, showPage, products, cart } = useApp();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [showAddOn, setShowAddOn] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const suggestedAddOns = findSuggestedAddOns(product, products, cart);
  const availableQuantity = product.availableQuantity ?? 0;
  const isAvailable = product.isActive !== false && product.price > 0 && availableQuantity > 0;
  const stars = '★'.repeat(Math.floor(product.rating));

  function handleAddToCart() {
    if (!isAvailable) {
      showToast('Out of stock', `${product.name} is not currently available`, 'error');
      return;
    }
    if (!isLoggedIn) {
      showToast('Login Required', 'Please login to add items to cart');
      showPage('login');
      return;
    }
    addToCart(product);
    showToast(product.name, 'Added to your cart successfully!');
    setAdded(true);
    setShowAddOn(suggestedAddOns.length > 0);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleAddOn(addOn: Product) {
    addToCart(addOn);
    showToast(addOn.name, 'Add-on added to your cart');
  }

  return (
    <>
    <div className="product-card reveal visible">
      {/* Badge */}
      {(!isAvailable || product.badge) && (
        <div style={{
          position: 'absolute', top: 16, left: 16,
          padding: '6px 14px',
          background: !isAvailable || product.badgeClass === 'hot' ? '#FF3333' : 'var(--neon)',
          color: !isAvailable || product.badgeClass === 'hot' ? 'white' : 'var(--black)',
          fontWeight: 700, fontSize: '0.75rem',
          borderRadius: 50, zIndex: 5,
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {!isAvailable ? 'Out of stock' : product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        onClick={() => setWishlisted(w => !w)}
        className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
        aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        aria-pressed={wishlisted}
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
        {wishlisted ? '♥' : '♡'}
      </button>

      {/* Image */}
      <button type="button" className="product-card-quick-view-trigger" onClick={() => setShowQuickView(true)} aria-label={`View details for ${product.name}`} style={{
        width: '100%', height: 240,
        background: 'var(--section-alt)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.4s ease', border: 0, padding: 0, cursor: 'pointer',
      }}>
        <img src={product.image} alt={product.name} className="card-image-inner" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 60,
          background: 'linear-gradient(transparent, var(--card-bg))',
        }} />
      </button>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--neon-dark)',
          fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: 1, marginBottom: 8,
        }}>
          {getProductCategoryLabel(product)}
        </div>
        <h3 style={{
          fontSize: '1.05rem', fontWeight: 700,
          marginBottom: 8, lineHeight: 1.4,
          color: 'var(--text)',
        }}>
          <button type="button" className="product-card-title-button" onClick={() => setShowQuickView(true)}>{product.name}</button>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.85rem' }}>
          <span style={{ color: '#FFD700', letterSpacing: 2 }}>{stars}</span>
          <span style={{ color: 'var(--text)' }}>{product.rating}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({product.reviews ?? 0})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>
              {cadFormatter.format(product.price)}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'line-through', marginLeft: 8 }}>
                {cadFormatter.format(product.oldPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span style={{ color: 'var(--neon-dark)', fontWeight: 700, fontSize: '0.85rem' }}>{discount}% OFF</span>
          )}
        </div>
        {isAvailable && availableQuantity <= 5 && (
          <p style={{ color: '#8a5200', fontSize: '0.78rem', fontWeight: 700, margin: '-6px 0 10px' }}>
            Only {availableQuantity} left
          </p>
        )}
        <button className={`card-add-btn ${added ? 'added' : ''}`} onClick={handleAddToCart} disabled={!isAvailable}>
          {!isAvailable ? 'OUT OF STOCK' : added ? 'ADDED' : 'ADD TO CART'}
        </button>
        {showAddOn && suggestedAddOns.length > 0 && (
          <div className="product-addon-panel">
            <strong>Complete your order</strong>
            <div className="product-addon-list">
              {suggestedAddOns.map(addOn => (
                <div className="product-addon-item" key={addOn.id}>
                  <span>{addOn.name}<small>{cadFormatter.format(addOn.price)}</small></span>
                  <button onClick={() => handleAddOn(addOn)} aria-label={`Add ${addOn.name} to cart`}>Add</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    {showQuickView && <ProductQuickView product={product} onClose={() => setShowQuickView(false)} />}
    </>
  );
}
