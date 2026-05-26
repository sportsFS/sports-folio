import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';

export default function Footer() {
  const { showPage } = useApp();

  return (
    <footer>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 48, maxWidth: 1200, margin: '0 auto',
        paddingBottom: 48, borderBottom: '1px solid #222',
      }}>
        {/* Brand */}
        <div>
          <button
            onClick={() => showPage('home')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <img src={logo} alt="Sports Folio" style={{ height: 40 }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              Sports Folio Store
            </span>
          </button>
          <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
            India's most trusted destination for premium cricket equipment. Gear up with the best — play like a champion.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            {['📘', '📸', '🐦', '📺'].map((icon, i) => (
              <a key={i} href="#" style={{
                width: 40, height: 40, borderRadius: 10,
                border: '1px solid #333', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: '#888', textDecoration: 'none', transition: 'all 0.3s ease',
                fontSize: '1rem',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--neon)';
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--neon)';
                (e.currentTarget as HTMLElement).style.color = '#000';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderColor = '#333';
                (e.currentTarget as HTMLElement).style.color = '#888';
              }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, color: '#FFF' }}>
            Quick Links
          </h4>
          {[
            { label: 'Home', page: 'home' },
            { label: 'Shop', page: 'shop' },
            { label: 'Contact', page: 'contact' },
            { label: 'Cart', page: 'cart' },
          ].map(item => (
            <button key={item.page} className="footer-link" onClick={() => showPage(item.page)}>
              {item.label}
            </button>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, color: '#FFF' }}>
            Categories
          </h4>
          {['Cricket Bats', 'Cricket Balls', 'Protective Gear', 'Footwear', 'Accessories'].map(cat => (
            <button key={cat} className="footer-link" onClick={() => showPage('shop')}>
              {cat}
            </button>
          ))}
        </div>

        {/* Support */}
        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, color: '#FFF' }}>
            Support
          </h4>
          <button className="footer-link" onClick={() => showPage('shipping')}>Shipping & Returns</button>
          <button className="footer-link" onClick={() => showPage('privacy')}>Privacy Policy</button>
          <button className="footer-link" onClick={() => showPage('terms')}>Terms of Service</button>
        </div>
      </div>

      <div style={{
        maxWidth: 1200, margin: '24px auto 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '0.8rem', color: '#666', flexWrap: 'wrap', gap: 12,
      }}>
        <span>© 2025 Sports Folio Store. All rights reserved.</span>
        <span>Made with 🏏 for cricket lovers</span>
      </div>
    </footer>
  );
}
