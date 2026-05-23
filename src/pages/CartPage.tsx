import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { cart, removeFromCart, updateQty, showPage, showToast, isLoggedIn, placeOrder } = useApp();
  const [promoCode, setPromoCode] = useState('');

  useEffect(() => {
    function triggerReveals() {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
      });
    }
    setTimeout(triggerReveals, 100);
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '5rem', marginBottom: 24, opacity: 0.3 }}>🛒</div>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', marginBottom: 12, color: 'var(--text)' }}>
            Your Cart is Empty
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
            Looks like you haven't added any cricket gear yet. Let's fix that!
          </p>
          <button className="btn-neon" onClick={() => showPage('shop')}>START SHOPPING</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ padding: '60px 40px 100px' }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            🛒 Cart
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)' }}>
            Your Shopping Cart
          </h2>
        </div>

        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 380px',
          gap: 40, alignItems: 'start',
        }}
          className="cart-grid"
        >
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cart.map((item, i) => (
              <div key={item.id} className="cart-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{
                  width: 100, height: 100, background: 'var(--section-alt)',
                  borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, overflow: 'hidden', padding: 8,
                }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4, color: 'var(--text)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8, textTransform: 'capitalize' }}>{item.category}</div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                    ${(item.price * item.qty).toLocaleString('en-US')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                  {/* Qty control */}
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--card-border)', borderRadius: 10, overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="qty-btn"
                      style={{ width: 36, height: 36, border: 'none', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                    >−</button>
                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="qty-btn"
                      style={{ width: 36, height: 36, border: 'none', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                    >+</button>
                  </div>
                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      width: 36, height: 36,
                      border: '1px solid var(--card-border)',
                      background: 'transparent', color: 'var(--text-secondary)',
                      borderRadius: 10, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease', fontSize: '1rem',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = '#FF3333';
                      (e.currentTarget as HTMLElement).style.color = 'white';
                      (e.currentTarget as HTMLElement).style.borderColor = '#FF3333';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)';
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 20, padding: 32, position: 'sticky', top: 100,
          }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--card-border)', color: 'var(--text)' }}>
              Order Summary
            </h3>

            <SummaryRow label={`Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} items)`} value={`$${subtotal.toLocaleString('en-US')}`} />
            <SummaryRow
              label="Shipping"
              value={shipping === 0 ? <span style={{ color: 'var(--neon-dark)', fontWeight: 700 }}>FREE</span> : `$${shipping}`}
            />
            <SummaryRow
              label="Discount (5%)"
              value={<span style={{ color: 'var(--neon-dark)' }}>-${discount.toLocaleString('en-US')}</span>}
            />

            {/* Promo */}
            <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                style={{
                  flex: 1, padding: '12px 16px',
                  border: '2px solid var(--card-border)', borderRadius: 10,
                  background: 'var(--input-bg)', color: 'var(--text)',
                  fontFamily: 'Space Grotesk, sans-serif', outline: 'none',
                }}
              />
              <button
                className="btn-outline"
                style={{ padding: '10px 20px', fontSize: '0.8rem', flexShrink: 0 }}
                onClick={() => showToast('Promo Applied!', 'Code CRICKET25 applied successfully')}
              >
                APPLY
              </button>
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', marginTop: 16, paddingTop: 16, borderTop: '2px solid var(--card-border)', color: 'var(--text)' }}>
              <span>Total</span>
               <span>${total.toLocaleString('en-US')}</span>
            </div>

            <button
              className="btn-neon"
              style={{ width: '100%', marginTop: 20 }}
              onClick={() => {
                if (!isLoggedIn) {
                  showToast('Login Required', 'Please login to checkout');
                  showPage('login');
                } else {
                  placeOrder();
                }
              }}
            >
              CHECKOUT →
            </button>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 12 }}>
              🔒 Secure checkout powered by Razorpay
            </p>

            <button
              onClick={() => showPage('shop')}
              style={{
                display: 'block', width: '100%', marginTop: 12,
                padding: '12px', textAlign: 'center',
                background: 'transparent', border: '1px solid var(--card-border)',
                borderRadius: 10, color: 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              ← Continue Shopping
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: '0.95rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
