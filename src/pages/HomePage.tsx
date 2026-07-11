import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { HERO_GAME_CATEGORIES } from '../data/catalog';

const flashItems = [
  '🔥 FLASH SALE — UP TO 50% OFF 🔥',
  '🏏 FREE SHIPPING ON ORDERS ABOVE $99 🚚',
  '⚡ FLAT $20 OFF ON FIRST ORDER ⚡',
  '💥 BUY 2 GET 1 FREE ON ACCESSORIES 💥',
  '🎯 USE CODE: CRICKET25 FOR 25% OFF 🎯',
  '🏆 PREMIUM BATS STARTING $199 🏆',
];

const brands = [
  { name: 'SS Cricket', short: 'SS', logo: '/images/brands/ss-cricket.png' },
  { name: 'SG Sports', short: 'SG', logo: '/images/brands/sg-sports.png' },
  { name: 'MRF', short: 'MRF', logo: '/images/brands/mrf.png' },
  { name: 'Gray-Nicolls', short: 'GN', logo: '/images/brands/gray-nicolls.png' },
  { name: 'Kookaburra', short: 'KB', logo: '/images/brands/kookaburra.png' },
  { name: 'GM Cricket', short: 'GM', logo: '/images/brands/gm-cricket.png' },
  { name: 'New Balance', short: 'NB', logo: '/images/brands/new-balance.png' },
  { name: 'Adidas Cricket', short: 'ADI', logo: '/images/brands/adidas-cricket.png' },
  { name: 'Puma Cricket', short: 'PUMA', logo: '/images/brands/puma-cricket.png' },
  { name: 'DSC', short: 'DSC', logo: '/images/brands/dsc.png' },
];
const motionPosterLogos = ['Cricket', 'Badminton', 'Pickleball'];

export default function HomePage() {
  const { showPage, showToast, products, setPresetCategory } = useApp();
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  useScrollReveal([productsLoaded]);

  // Skeleton → Products
  useEffect(() => {
    const t = setTimeout(() => setProductsLoaded(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Parallax
  useEffect(() => {
    function handleParallax() {
      if (!parallaxRef.current || !parallaxBgRef.current) return;
      const rect = parallaxRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        parallaxBgRef.current.style.transform = `translateY(${(scrolled - 0.5) * 100}px)`;
      }
    }
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);

  const [heroIndex, setHeroIndex] = useState(0);

  const heroImages = [
    '/images/hero/AdobeStock_305237820.jpeg',
    '/images/hero/AdobeStock_473788569.jpeg',
    '/images/hero/Max_a_A_hyper-realistic_4K.png',
    '/images/hero/Max_a_Gritty,_high-octane_.png',
    '/images/hero/Max_a_Professional_sports_.png',
  ];

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(prev => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    showToast('Subscribed! 🎉', 'Welcome to the Crease Club!');
    setEmail('');
  }

  function shopGameCategory(category: string) {
    setPresetCategory(category);
    showPage('shop');
  }

  return (
    <>
      {/* ====== HERO ====== */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 72,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* Full-screen image carousel */}
        <div className="hero-carousel">
          {heroImages.map((img, i) => (
            <div key={i} className={`hero-carousel-slide ${i === heroIndex ? 'active' : ''}`}>
              <img src={img} alt={`Sports ${i + 1}`} className="hero-carousel-img" />
            </div>
          ))}
        </div>

        {/* Dark gradient overlay */}
        <div className="hero-overlay" />

        {/* Dot navigation */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, display: 'flex', gap: 8,
        }}>
          {heroImages.map((_, i) => (
            <button key={i} className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>

        {/* Content */}
        <div className="hero-content">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px',
            background: 'rgba(170,255,0,0.15)', border: '1px solid rgba(170,255,0,0.4)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon)',
            marginBottom: 24, backdropFilter: 'blur(8px)',
          }}>
            🏆 SPORTS EQUIPMENT
          </div>

          <h1 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem,5vw,4rem)',
            fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#fff',
          }}>
            Your Game. <span style={{ color: 'var(--neon)', textShadow: '0 0 30px var(--neon-glow)' }}>Your Gear.</span><br />
            Your Store.
          </h1>

          <p style={{
            fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7,
            marginBottom: 32, maxWidth: 550, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Premium sports equipment for every athlete, from cricket to badminton,
            pickleball, soccer, volleyball, and training. Gear up and play your best.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <button className="btn-neon" onClick={() => shopGameCategory('cricket')}>SHOP NOW -&gt;</button>
            <button className="btn-outline" onClick={() => showPage('shop')}
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
              EXPLORE MORE
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {HERO_GAME_CATEGORIES.map(game => (
              <button key={game.value} className="hero-cat-link" onClick={() => shopGameCategory(game.value)}>
                {game.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FLASH SALE ====== */}
      <div className="flash-sale-bar">
        <div className="flash-sale-track">
          {[...flashItems, ...flashItems].map((item, i) => (
            <div key={i} className="flash-sale-item">{item}</div>
          ))}
        </div>
      </div>

      {/* ====== SHOP BY GAME ====== */}
      <section style={{ padding: '86px 40px', background: 'var(--bg)' }}>
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 700, fontSize: '0.78rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16,
          }}>Shop by game</div>
          <h2 className="section-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.35rem', fontWeight: 850, marginBottom: 12, color: 'var(--text)' }}>
            Find Gear by Sport
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
            Cricket leads the catalog today, with dedicated paths ready for badminton, pickleball, soccer, and volleyball.
          </p>
        </div>
        <div className="game-category-grid">
          {HERO_GAME_CATEGORIES.map(game => (
            <button key={game.value} className="game-category-card reveal" onClick={() => shopGameCategory(game.value)}>
              <span>{game.label}</span>
              <small>Shop {game.label}</small>
            </button>
          ))}
        </div>
      </section>

      {/* ====== TRENDING PRODUCTS ====== */}
      <section style={{ padding: '100px 40px', background: 'var(--section-alt)' }}>
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
          }}>🔥 Trending</div>
          <h2 className="section-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
            Trending Right Now
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Most loved products by our cricket community this season
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24, maxWidth: 1400, margin: '0 auto',
        }}>
          {!productsLoaded
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : products.slice(0, 6).map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <button className="btn-neon" onClick={() => showPage('shop')}>VIEW ALL PRODUCTS →</button>
        </div>
      </section>

      {/* ====== PARALLAX BANNER ====== */}
      <div className="parallax-banner" ref={parallaxRef}>
        <div ref={parallaxBgRef} style={{
          position: 'absolute', top: '-50%', left: 0,
          width: '100%', height: '200%',
          background: `radial-gradient(ellipse at 30% 50%, rgba(170,255,0,0.15) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 50%, rgba(170,255,0,0.1) 0%, transparent 60%)`,
          willChange: 'transform',
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 20px', width: '100%' }}>
          <p style={{ color: 'var(--neon)', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 }}>
            SPORTSFOLIO game brands
          </p>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 22 }}>
            Motion Poster for <span style={{ color: 'var(--neon)', textShadow: '0 0 30px var(--neon-glow)' }}>Match Day</span>
          </h2>
          <div className="motion-logo-row" aria-label="Cricket, Badminton, and Pickleball brand logos">
            {[...motionPosterLogos, ...motionPosterLogos].map((label, i) => (
              <button key={`${label}-${i}`} className="motion-logo-mark" onClick={() => shopGameCategory(label.toLowerCase())}>
                <span>SF</span>
                <strong>{label}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ====== FEATURES ====== */}
      <section style={{ padding: '100px 40px' }}>
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
          }}>✨ Why Us</div>
          <h2 className="section-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
            Why Choose Sports Folio?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            We don't just sell gear — we equip champions
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 24, maxWidth: 1200, margin: '0 auto',
        }}>
          {[
            { icon: '🚚', title: 'Free Express Shipping', desc: 'Lightning fast delivery across India. Free on all orders above $99.' },
            { icon: '✅', title: '100% Authentic', desc: 'Every product is genuine and sourced directly from authorized manufacturers.' },
            { icon: '🔄', title: 'Easy Returns', desc: 'Not satisfied? Return within 30 days with our no-hassle return policy.' },
            { icon: '💬', title: 'Expert Support', desc: 'Our cricket experts are available 24/7 to help you choose the right gear.' },
          ].map(feat => (
            <div key={feat.title} className="feature-card reveal">
              <div style={{
                width: 56, height: 56, background: 'rgba(170,255,0,0.1)',
                borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', marginBottom: 20,
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8, color: 'var(--text)' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== BRANDS ====== */}
      <div style={{ padding: '60px 0', overflow: 'hidden', background: 'var(--section-alt)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
            Trusted Brands
          </span>
        </div>
        <div className="brands-track">
          {[...brands, ...brands].map((brand, i) => (
            <span key={`${brand.name}-${i}`} className="brand-logo-item" aria-label={brand.name}>
              <img
                src={brand.logo}
                alt={brand.name}
                className="brand-logo-image"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                  event.currentTarget.nextElementSibling?.removeAttribute('hidden');
                }}
              />
              <span className="brand-logo-fallback" hidden>{brand.short}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ====== TESTIMONIALS ====== */}
      <section style={{ padding: '100px 40px' }}>
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
          }}>💬 Testimonials</div>
          <h2 className="section-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
            What Players Say
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            Hear from our community of passionate cricketers
          </p>
        </div>
        <TestimonialsCarousel />
      </section>

      {/* ====== NEWSLETTER ====== */}
      <section style={{ padding: '100px 40px', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 400, height: 400, background: 'var(--neon)',
          borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, top: -200, left: -100,
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, background: 'var(--neon)',
          borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15, bottom: -200, right: -100,
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 600, margin: '0 auto' }} className="reveal">
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            JOIN THE CREASE CLUB
          </h2>
          <p style={{ color: '#999', marginBottom: 32, lineHeight: 1.7 }}>
            Subscribe to get exclusive deals, early access to new arrivals, and cricket tips from the pros.
          </p>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 12, maxWidth: 500, margin: '0 auto', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                flex: 1, minWidth: 200, padding: '16px 24px', border: '2px solid #333',
                borderRadius: 50, background: '#111', color: 'white', fontSize: '0.95rem',
                fontFamily: 'Space Grotesk, sans-serif', outline: 'none',
              }}
            />
            <button type="submit" className="btn-neon">SUBSCRIBE</button>
          </form>
        </div>
      </section>
    </>
  );
}

const testimonialData = [
  { initials: 'RP', name: 'Rajmohan PM', role: 'Verified Buyer', text: 'Bought my new MRF original from Sportfolio. Got my bat today after oiling and knocking. Amal helped me choose the best for my budget and requirements. Very helpful staff, and lots of good original stock. Very happy with product and service.' },
  { initials: 'VV', name: 'Vivek Venu', role: 'Verified Buyer', text: 'The prices are very competitive, especially considering the quality and expertise you receive. If you are serious about cricket and demand the best gear and advice, make SportsFolio your first and last stop. Highly recommended!' },
  { initials: 'JS', name: 'Jino Sunny', role: 'Verified Buyer', text: 'I recently purchased a R10 scooped cricket bat from Sportsfolio. The bat has excellent balance, making it easy to maneuver. The sweet spot is large, and the pickup is perfect. The customer service was excellent — they guided me in selecting the right bat based on my style of play.' },
  { initials: 'AR', name: 'Ananth Rao', role: 'Verified Buyer', text: 'Had a fantastic experience purchasing two Galaxian cricket bats from Sportsfolio. Lightweight with excellent bat speed, perfect for big hits. Amal provided outstanding customer service through WhatsApp, making the entire process smooth despite ordering from the US to Canada.' },
  { initials: 'JM', name: 'Joby Mathew', role: 'Verified Buyer', text: 'Hands down the best sports shop I\'ve ever been to! Extensive range of top-quality gear. The staff is incredibly knowledgeable and passionate about sports. Prices are very competitive for the quality. I highly recommend Sportsfolio and will definitely be coming back!' },
];

function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex(prev => (prev + 1) % testimonialData.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ position: 'relative', minHeight: 280 }}>
        {testimonialData.map((t, i) => (
          <div
            key={t.name}
            style={{
              position: 'absolute', width: '100%',
              opacity: i === index ? 1 : 0,
              transform: i === index ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: i === index ? 'auto' : 'none',
            }}
          >
            <div className="testimonial-card reveal visible" style={{ textAlign: 'center' }}>
              <div style={{ color: '#FFD700', fontSize: '1.1rem', letterSpacing: 3, marginBottom: 20 }}>★★★★★</div>
              <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 28, fontStyle: 'italic' }}>
                {t.text}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--neon)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem', color: 'var(--black)',
                }}>
                  {t.initials}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
        {testimonialData.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? 24 : 10, height: 10,
              borderRadius: 5, border: 'none',
              background: i === index ? 'var(--neon)' : 'var(--card-border)',
              cursor: 'pointer', transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
