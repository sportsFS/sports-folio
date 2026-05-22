import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { theme, toggleTheme, cartCount, currentPage, showPage } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navItems = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Contact Us', page: 'contact' },
    { label: 'Cart', page: 'cart' },
  ];

  function navClick(page: string) {
    showPage(page);
    setMobileOpen(false);
  }

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      {/* Logo */}
      <button
        onClick={() => navClick('home')}
        style={{
          fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: '1.3rem',
          color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <div style={{
          width: 36, height: 36, background: 'var(--neon)', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.1rem', color: 'var(--black)', fontWeight: 900,
        }}>
          🏏
        </div>
        <span>SPORTS </span>
        <span style={{ color: theme === 'dark' ? 'var(--neon)' : 'var(--neon-dark)' }}>FOLIO</span>
      </button>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        className="desktop-nav">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => navClick(item.page)}
            style={{
              textDecoration: 'none',
              fontWeight: 600, fontSize: '0.9rem',
              padding: '8px 20px', borderRadius: 50,
              transition: 'all 0.3s ease', cursor: 'pointer',
              background: currentPage === item.page ? 'var(--neon)' : 'transparent',
              color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
              boxShadow: currentPage === item.page ? '0 0 20px var(--neon-glow)' : 'none',
              border: 'none', fontFamily: 'Inter, sans-serif',
            } as React.CSSProperties}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 56, height: 28,
            background: theme === 'dark' ? '#333' : 'var(--input-bg)',
            borderRadius: 50, position: 'relative', cursor: 'pointer',
            border: theme === 'dark' ? '2px solid var(--neon)' : '2px solid var(--card-border)',
            transition: 'all 0.3s ease', flexShrink: 0,
          }}
          aria-label="Toggle theme"
        >
          <span style={{
            position: 'absolute', top: 2,
            left: theme === 'dark' ? 30 : 2,
            width: 20, height: 20,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', transition: 'all 0.3s ease',
          }}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => navClick('cart')}
          style={{
            position: 'relative', width: 44, height: 44,
            borderRadius: 12,
            background: theme === 'dark' ? 'var(--neon)' : 'var(--black)',
            color: theme === 'dark' ? 'var(--black)' : 'var(--white)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', cursor: 'pointer', border: 'none',
            transition: 'all 0.3s ease', flexShrink: 0,
          }}
        >
          🛒
          {cartCount > 0 && (
            <span className="cart-pop" style={{
              position: 'absolute', top: -6, right: -6,
              width: 22, height: 22,
              background: 'var(--neon)', color: 'var(--black)',
              borderRadius: '50%', fontSize: '0.7rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px var(--neon-glow)',
            }}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu */}
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="mobile-menu-trigger"
          style={{
            display: 'none', width: 44, height: 44,
            border: 'none', background: 'transparent', cursor: 'pointer',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all 0.3s', transform: mobileOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--text)', borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'all 0.3s' }} />
          <span style={{ display: 'block', width: 24, height: 2, background: 'var(--text)', borderRadius: 2, transition: 'all 0.3s', transform: mobileOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="mobile-nav-open">
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => navClick(item.page)}
              style={{
                fontWeight: 600, fontSize: '0.9rem',
                padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                border: 'none', fontFamily: 'Inter, sans-serif',
                textAlign: 'left', width: '100%',
              } as React.CSSProperties}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-trigger { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
