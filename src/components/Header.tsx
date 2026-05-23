import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';

const categoryLinks = [
  { label: 'All Products', value: 'all' },
  { label: 'Cricket Bats', value: 'bats' },
  { label: 'Cricket Balls', value: 'balls' },
  { label: 'Protective Gear', value: 'protection' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Accessories', value: 'accessories' },
];

export default function Header() {
  const { theme, toggleTheme, cartCount, currentPage, showPage, setPresetCategory } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

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
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        <img src={logo} alt="Sports Folio" style={{ height: 40 }} />
        <span className="header-logo-text" style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)' }}>
          Sports Folio Store
        </span>
      </button>

      {/* Desktop Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        className="desktop-nav">
        {navItems.map(item => {
          if (item.page === 'shop') {
            return (
              <div
                key={item.page}
                className="shop-dropdown-wrapper"
                style={{ position: 'relative' }}
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  onClick={() => { setPresetCategory('all'); navClick(item.page); }}
                  style={{
                    textDecoration: 'none',
                    fontWeight: 600, fontSize: '0.9rem',
                    padding: '8px 20px', borderRadius: 50,
                    transition: 'all 0.3s ease', cursor: 'pointer',
                    background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                    color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                    boxShadow: currentPage === item.page ? '0 0 20px var(--neon-glow)' : 'none',
                    border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                  } as React.CSSProperties}
                >
                  Shop {shopOpen ? '▲' : '▼'}
                </button>
                {shopOpen && (
                  <div className="shop-dropdown-menu">
                    {categoryLinks.map(cat => (
                      <button
                        key={cat.value}
                        className="shop-dropdown-item"
                        onClick={() => { setPresetCategory(cat.value); navClick('shop'); }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
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
                border: 'none', fontFamily: 'Space Grotesk, sans-serif',
              } as React.CSSProperties}
            >
              {item.label}
            </button>
          );
        })}
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
          {navItems.map(item => {
            if (item.page === 'shop') {
              return (
                <div key={item.page} style={{ width: '100%' }}>
                  <button
                    onClick={() => setShopOpen(s => !s)}
                    style={{
                      fontWeight: 600, fontSize: '0.9rem',
                      padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                      background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                      color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                      border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                      textAlign: 'left', width: '100%',
                    } as React.CSSProperties}
                  >
                    Shop {shopOpen ? '▲' : '▼'}
                  </button>
                  {shopOpen && (
                    <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {categoryLinks.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => { setPresetCategory(cat.value); navClick('shop'); }}
                          style={{
                            fontWeight: 500, fontSize: '0.85rem',
                            padding: '8px 16px', borderRadius: 50, cursor: 'pointer',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                            textAlign: 'left', width: '100%',
                          } as React.CSSProperties}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <button
                key={item.page}
                onClick={() => navClick(item.page)}
                style={{
                  fontWeight: 600, fontSize: '0.9rem',
                  padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                  background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                  color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                  border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                  textAlign: 'left', width: '100%',
                } as React.CSSProperties}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .shop-dropdown-menu {
          position: absolute; top: calc(100% + 8px); left: 0;
          background: var(--card-bg); border: 1px solid var(--card-border);
          border-radius: 12px; padding: 6px; min-width: 180px;
          z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          animation: fadeDown 0.2s ease;
        }
        .shop-dropdown-item {
          display: block; width: 100%; text-align: left;
          padding: 8px 14px; border-radius: 8px; border: none;
          background: transparent; cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.85rem; color: var(--text);
          transition: background 0.2s;
        }
        .shop-dropdown-item:hover {
          background: rgba(170,255,0,0.15);
          color: var(--neon-dark);
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-trigger { display: flex !important; }
        }
        @media (max-width: 600px) {
          .header-logo-text { display: none; }
        }
      `}</style>
    </header>
  );
}
