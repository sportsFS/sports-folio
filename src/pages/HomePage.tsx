import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const flashItems = [
  '🔥 FLASH SALE — UP TO 50% OFF 🔥',
  '🏏 FREE SHIPPING ON ORDERS ABOVE $99 🚚',
  '⚡ FLAT $20 OFF ON FIRST ORDER ⚡',
  '💥 BUY 2 GET 1 FREE ON ACCESSORIES 💥',
  '🎯 USE CODE: CRICKET25 FOR 25% OFF 🎯',
  '🏆 PREMIUM BATS STARTING $199 🏆',
];

const brands = ['SS Cricket', 'SG Sports', 'MRF', 'Gray-Nicolls', 'Kookaburra', 'GM Cricket', 'New Balance', 'Adidas Cricket', 'Puma Cricket', 'DSC'];

export default function HomePage() {
  const { showPage, showToast } = useApp();
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [email, setEmail] = useState('');
  const parallaxRef = useRef<HTMLDivElement>(null);
  const parallaxBgRef = useRef<HTMLDivElement>(null);

  // Reveal on scroll
  useEffect(() => {
    function triggerReveals() {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
          el.classList.add('visible');
        }
      });
    }
    triggerReveals();
    window.addEventListener('scroll', triggerReveals);
    return () => window.removeEventListener('scroll', triggerReveals);
  }, [productsLoaded]);

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

  // Particles
  useEffect(() => {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      const size = (2 + Math.random() * 4) + 'px';
      p.style.width = size;
      p.style.height = size;
      container.appendChild(p);
    }
  }, []);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    showToast('Subscribed! 🎉', 'Welcome to the Crease Club!');
    setEmail('');
  }

  return (
    <>
      {/* ====== HERO ====== */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 72,
      }}>
        {/* BG */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <div className="hero-grid" />
          <div className="hero-gradient-orb orb1" />
          <div className="hero-gradient-orb orb2" />
          <div className="hero-gradient-orb orb3" />
          <div id="heroParticles" style={{ position: 'absolute', width: '100%', height: '100%' }} />
        </div>

        {/* Floating emojis */}
        <div className="cricket-ball-float" style={{ top: '20%', left: '10%', fontSize: '4rem', animationDelay: '0s' }}>🏏</div>
        <div className="cricket-ball-float" style={{ top: '70%', right: '10%', fontSize: '3rem', animationDelay: '1s' }}>🔴</div>
        <div className="cricket-ball-float" style={{ top: '40%', right: '20%', fontSize: '2.5rem', animationDelay: '2s' }}>🏆</div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900, padding: '0 20px' }}>
          <div className="anim-1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '10px 24px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.85rem', color: 'var(--neon-dark)',
            marginBottom: 30, backdropFilter: 'blur(10px)',
          }}>
            <span className="dot-pulse" />
            Season 2025 Collection Now Live
          </div>

          <h1 className="anim-2" style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem,6vw,4.5rem)',
            fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: 'var(--text)',
          }}>
            UNLEASH YOUR<br />
            <span className="neon-highlight">CRICKET BEAST</span>
          </h1>

          <p className="anim-3" style={{
            fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.8,
            marginBottom: 40, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto',
          }}>
            Premium cricket equipment crafted for champions. From willow bats to protective gear — elevate every shot, every delivery, every catch.
          </p>

          <div className="anim-4" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-neon" onClick={() => showPage('shop')}>🛒 SHOP NOW</button>
            <button className="btn-outline" onClick={() => showPage('shop')}>EXPLORE COLLECTION</button>
          </div>

          <div className="anim-5" style={{
            display: 'flex', gap: 48, justifyContent: 'center', marginTop: 60, flexWrap: 'wrap',
          }}>
            {[
              { num: '500+', label: 'Products' },
              { num: '50K+', label: 'Happy Customers' },
              { num: '4.9', label: 'Average Rating' },
              { num: '24/7', label: 'Support' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2rem', fontWeight: 900, color: 'var(--neon-dark)' }}>
                  {stat.num}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
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

      {/* ====== TRENDING PRODUCTS ====== */}
      <section style={{ padding: '100px 40px', background: 'var(--section-alt)' }}>
        <div className="section-header reveal" style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
          }}>🔥 Trending</div>
          <h2 className="section-title" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
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
            : allProducts.slice(0, 6).map(p => <ProductCard key={p.id} product={p} />)
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
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white', padding: '0 20px' }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, marginBottom: 16 }}>
            GEAR UP FOR <span style={{ color: 'var(--neon)', textShadow: '0 0 30px var(--neon-glow)' }}>VICTORY</span>
          </h2>
          <p style={{ color: '#AAA', fontSize: '1.1rem', marginBottom: 32 }}>
            Professional grade equipment trusted by national level players
          </p>
          <button className="btn-neon" onClick={() => showPage('shop')}>EXPLORE PRO RANGE</button>
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
          <h2 className="section-title" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
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
            <span key={i} style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: '1.3rem', fontWeight: 700,
              color: 'var(--text-secondary)', opacity: 0.5, whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
            }}>
              {brand}
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
          <h2 className="section-title" style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
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
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: '#fff', marginBottom: 16 }}>
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
                fontFamily: 'Inter, sans-serif', outline: 'none',
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
  { initials: 'RK', name: 'Rahul Kumar', role: 'District Level Player', text: '"The SS Ton Player bat I bought here is phenomenal! The pickup is incredible and the sweet spot is massive. Scored my first century with it. Sports Folio is now my go-to store."' },
  { initials: 'PS', name: 'Priya Sharma', role: "Women's Team Captain", text: '"Amazing quality and super fast delivery. The protective gear saved me during a crucial match. Their customer support helped me choose the perfect size. Highly recommended!"' },
  { initials: 'AV', name: 'Arun Verma', role: 'Club Cricketer', text: '"Best prices I\'ve found anywhere for premium cricket gear. The MRF Genius bat is absolute class. Delivery was quick and packaging was excellent. Will shop here again for sure!"' },
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
