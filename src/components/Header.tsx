import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';
import SearchBar from './SearchBar';

const categoryLinks = [
  { label: 'All Products', value: 'all' },
  { label: 'Cricket Bats', value: 'bats' },
  { label: 'Protective Gear', value: 'protection' },
  { label: 'Gloves & Wicket Keeping', value: 'gloves' },
  { label: 'Cricket Balls', value: 'balls' },
  { label: 'Apparel, Bags & Kits', value: 'apparel' },
  { label: 'Accessories & Training', value: 'accessories' },
];

export default function Header() {
  const { theme, toggleTheme, cartCount, currentPage, showPage, setPresetCategory, user, isLoggedIn, isAdmin, logout } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  function navClick(page: string) {
    showPage(page);
    setMobileOpen(false);
    setShopOpen(false);
  }

  function handleLogout() {
    logout();
    navClick('home');
  }

  const navItems: { label: string; page: string; type?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Contact Us', page: 'contact' },
  ];
  if (!isLoggedIn) {
    navItems.push({ label: 'Login', page: 'login' });
    navItems.push({ label: 'Register', page: 'register' });
  } else {
    if (isAdmin) navItems.push({ label: 'Admin Panel', page: 'admin' });
    navItems.push({ label: 'My Orders', page: 'my-orders' });
    navItems.push({ label: `Hi, ${user!.name.split(' ')[0]}`, page: '', type: 'user' });
    navItems.push({ label: 'Logout', page: '', type: 'logout' });
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
        {navItems.map((item, idx) => {
          if (item.type === 'user') {
            return (
              <span key={'user-' + idx} style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--neon-dark)', padding: '0 8px', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            );
          }
          if (item.type === 'logout') {
            return (
              <button key={'logout-' + idx} onClick={handleLogout} className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                Logout
              </button>
            );
          }
          if (item.page === 'shop') {
            return (
              <div key={item.page} className="shop-dropdown-wrapper" style={{ position: 'relative' }}
                onMouseEnter={() => { if (shopTimeout.current) clearTimeout(shopTimeout.current); setShopOpen(true); }}
                onMouseLeave={() => { shopTimeout.current = setTimeout(() => setShopOpen(false), 200); }}
              >
                <button
                  onClick={() => { setPresetCategory('all'); navClick(item.page); }}
                  style={{
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
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
                      <button key={cat.value} className="shop-dropdown-item"
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
            <button key={item.page} onClick={() => navClick(item.page)}
              style={{
                textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem',
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
        <SearchBar />
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

        {/* Sign In Pill — always visible */}
        {!isLoggedIn && (
          <button
            onClick={() => navClick('login')}
            className="btn-neon"
            style={{ padding: '8px 18px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            Sign In
          </button>
        )}

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
          {navItems.map((item, idx) => {
            if (item.type === 'user') {
              return (
                <div key={'user-' + idx} style={{ padding: '12px 20px', fontWeight: 600, fontSize: '0.9rem', color: 'var(--neon-dark)' }}>
                  {item.label}
                </div>
              );
            }
            if (item.type === 'logout') {
              return (
                <button key={'logout-' + idx} onClick={handleLogout} style={{
                  fontWeight: 600, fontSize: '0.9rem',
                  padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                  background: 'transparent',
                  color: '#FF3333',
                  border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                  textAlign: 'left', width: '100%',
                } as React.CSSProperties}>
                  Logout
                </button>
              );
            }
            if (item.page === 'shop') {
              return (
                <div key={item.page} style={{ width: '100%' }}>
                  <button onClick={() => setShopOpen(s => !s)} style={{
                    fontWeight: 600, fontSize: '0.9rem',
                    padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                    background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                    color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                    border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                    textAlign: 'left', width: '100%',
                  } as React.CSSProperties}>
                    Shop {shopOpen ? '▲' : '▼'}
                  </button>
                  {shopOpen && (
                    <div style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {categoryLinks.map(cat => (
                        <button key={cat.value}
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
              <button key={item.page} onClick={() => navClick(item.page)} style={{
                fontWeight: 600, fontSize: '0.9rem',
                padding: '12px 20px', borderRadius: 50, cursor: 'pointer',
                background: currentPage === item.page ? 'var(--neon)' : 'transparent',
                color: currentPage === item.page ? 'var(--black)' : 'var(--text)',
                border: 'none', fontFamily: 'Space Grotesk, sans-serif',
                textAlign: 'left', width: '100%',
              } as React.CSSProperties}>
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        .shop-dropdown-menu {
          position: absolute; top: 100%; left: 0;
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
