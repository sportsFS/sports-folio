import { useApp } from '../context/AppContext';
import logo from '../assets/logo.png';
import { SHOP_FILTER_CATEGORIES } from '../data/catalog';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/sportsfoliostore', glyph: 'IG' },
  { label: 'Facebook', href: 'https://www.facebook.com/sportsfoliostore', glyph: 'FB' },
  { label: 'WhatsApp', href: 'https://wa.me/', glyph: 'WA' },
  { label: 'Email', href: 'mailto:hello@sportsfolio.store', glyph: '@' },
];

export default function Footer() {
  const { showPage, setPresetCategory } = useApp();

  function showShopCategory(category: string) {
    setPresetCategory(category);
    showPage('shop');
  }

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
            <img src={logo} alt="SPORTSFOLIO" style={{ height: 40 }} />
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              SPORTSFOLIO
            </span>
          </button>
          <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 20 }}>
            India's most trusted destination for premium cricket equipment. Gear up with the best — play like a champion.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {socials.map(social => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target={social.href.startsWith('http') ? '_blank' : undefined}
                rel={social.href.startsWith('http') ? 'noreferrer' : undefined}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  border: '1px solid #333', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#D8D8D8', cursor: 'pointer', fontSize: '0.78rem',
                  fontWeight: 800, textDecoration: 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                {social.glyph}
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
          {SHOP_FILTER_CATEGORIES.filter(cat => ['cricket', 'badminton', 'pickleball', 'soccer', 'volleyball', 'jerseys', 'awards', 'dtf'].includes(cat.value)).map(cat => (
            <button key={cat.value} className="footer-link" onClick={() => showShopCategory(cat.value)}>
              {cat.label}
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
        <span>© 2026 SPORTSFOLIO. All rights reserved.</span>
        <span>Built for every match day</span>
      </div>
    </footer>
  );
}
