import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { findSuggestedAddOns, HERO_GAME_CATEGORIES, productMatchesCategory } from '../data/catalog';

const brands = [
  { name: 'SS Cricket', slug: 'ss', short: 'SS', logo: '/images/brands/ss-cricket.png' },
  { name: 'SG Sports', slug: 'sg', short: 'SG', logo: '/images/brands/sg-sports.png' },
  { name: 'MRF', slug: 'mrf', short: 'MRF', logo: '/images/brands/mrf.png' },
  { name: 'Gray-Nicolls', slug: 'gray-nicolls', short: 'GN', logo: '/images/brands/gray-nicolls.png' },
  { name: 'Kookaburra', slug: 'kookaburra', short: 'KB', logo: '/images/brands/kookaburra.png' },
  { name: 'GM Cricket', slug: 'gm', short: 'GM', logo: '/images/brands/gm-cricket.png' },
  { name: 'New Balance', slug: 'new-balance', short: 'NB', logo: '/images/brands/new-balance.png' },
  { name: 'Adidas Cricket', slug: 'adidas', short: 'ADI', logo: '/images/brands/adidas-cricket.png' },
  { name: 'Puma Cricket', slug: 'puma', short: 'PUMA', logo: '/images/brands/puma-cricket.png' },
  { name: 'DSC', slug: 'dsc', short: 'DSC', logo: '/images/brands/dsc.png' },
];

const departmentDeck = [
  { value: 'bats', label: 'Cricket bats', detail: 'English, Kashmir and tape-ball bats', size: 'feature' },
  { value: 'protection', label: 'Protective gear', detail: 'Pads, guards and match protection', size: 'standard' },
  { value: 'balls', label: 'Cricket balls', detail: 'Leather, practice and tennis balls', size: 'standard' },
  { value: 'accessories', label: 'Training and care', detail: 'Grips, bat care and practice gear', size: 'wide' },
  { value: 'jerseys', label: 'Jerseys', detail: 'Team colours and match-day wear', size: 'wide' },
];

export default function HomePage() {
  const { showPage, products, setPresetCategory } = useApp();

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

  function shopGameCategory(category: string) {
    setPresetCategory(category);
    showPage('shop');
  }

  const departments = departmentDeck.map(department => {
    const matchingProducts = products.filter(product => productMatchesCategory(product, department.value));
    return {
      ...department,
      image: matchingProducts.find(product => product.image)?.image,
      count: matchingProducts.length,
    };
  });

  const featuredProducts = products
    .filter(product => product.isActive !== false && product.price > 0)
    .sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
    .slice(0, 8);

  const featuredBat = products.find(product => product.category === 'bats' && findSuggestedAddOns(product, products).length > 0);
  const featuredAddOn = featuredBat ? findSuggestedAddOns(featuredBat, products)[0] : undefined;

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

      <main className="home-page">
        <section className="home-assurance" aria-label="Store policies">
          <div>
            <strong>Delivery across Canada</strong>
            <span>Canadian addresses are confirmed at checkout.</span>
          </div>
          <div>
            <strong>Stripe-secured payment</strong>
            <span>Order totals and delivery charges are shown before payment.</span>
          </div>
          <div>
            <strong>Exchange or replacement</strong>
            <span>Eligible requests can be submitted within 30 days of delivery.</span>
          </div>
        </section>

        <nav className="home-game-nav" aria-label="Shop by game">
          <span>Shop by game</span>
          <div>
            {HERO_GAME_CATEGORIES.map(game => (
              <button key={game.value} onClick={() => shopGameCategory(game.value)}>{game.label}</button>
            ))}
            <button onClick={() => shopGameCategory('volleyball')}>Volleyball</button>
            <button onClick={() => shopGameCategory('awards')}>Awards</button>
            <button onClick={() => shopGameCategory('dtf')}>DTF</button>
          </div>
        </nav>

        <section className="home-section home-departments">
          <div className="home-section-heading">
            <h2>Start with what you need.</h2>
            <p>Browse real departments from the current catalog, then narrow by brand, price, or availability in the shop.</p>
          </div>
          <div className="home-department-grid">
            {departments.map(department => (
              <button
                key={department.value}
                className={`home-department-card home-department-card--${department.size}`}
                onClick={() => shopGameCategory(department.value)}
              >
                {department.image && <img src={department.image} alt="" loading="lazy" />}
                <span className="home-department-shade" />
                <span className="home-department-copy">
                  <strong>{department.label}</strong>
                  <small>{department.detail}</small>
                  <b>{department.count} {department.count === 1 ? 'product' : 'products'}</b>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-section home-products-section">
          <div className="home-section-heading home-section-heading--products">
            <div>
              <h2>Gear worth a closer look.</h2>
              <p>In-stock status and available quantities are controlled by the store owner.</p>
            </div>
            <button className="home-text-link" onClick={() => showPage('shop')}>
              View all {products.length > 0 ? products.length : ''} products
            </button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="home-product-grid">
              {featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="home-catalog-empty">
              <strong>The catalog is loading.</strong>
              <span>Products will appear here as soon as the store connection responds.</span>
            </div>
          )}
        </section>

        {featuredBat && featuredAddOn && (
          <section className="home-section home-kit-section">
            <div className="home-kit-visual" aria-label={`${featuredBat.name} with ${featuredAddOn.name}`}>
              <figure className="home-kit-product home-kit-product--bat">
                <img src={featuredBat.image} alt={featuredBat.name} loading="lazy" />
                <figcaption>{featuredBat.name}</figcaption>
              </figure>
              <span className="home-kit-plus" aria-hidden="true">+</span>
              <figure className="home-kit-product home-kit-product--addon">
                <img src={featuredAddOn.image} alt={featuredAddOn.name} loading="lazy" />
                <figcaption>{featuredAddOn.name}</figcaption>
              </figure>
            </div>
            <div className="home-kit-copy">
              <h2>Complete the kit before checkout.</h2>
              <p>Selected bats can suggest compatible balls and accessories after they are added to cart. Suggestions follow the add-ons managed by the store owner.</p>
              <button className="btn-neon" onClick={() => shopGameCategory('bats')}>Shop cricket bats</button>
            </div>
          </section>
        )}

        <section className="home-store-standard">
          <div>
            <h2>Clear terms. No surprise promises.</h2>
            <p>SPORTSFOLIO currently delivers to Canadian addresses. Delivery charges are confirmed before payment, and eligible delivered orders can request an exchange or replacement.</p>
          </div>
          <button className="home-text-link" onClick={() => showPage('shipping')}>Read the delivery policy</button>
        </section>

        <section className="home-brands" aria-labelledby="home-brands-title">
          <div className="home-brands-heading">
            <h2 id="home-brands-title">Brands players recognise.</h2>
            <p>Browse established cricket labels already represented across the SPORTSFOLIO catalog.</p>
          </div>
          <div className="home-brands-window">
            <div className="home-brands-track">
              {[0, 1].map(group => (
                <div className="home-brand-sequence" key={group} aria-hidden={group === 1 ? 'true' : undefined}>
                  {brands.map(brand => (
                    <span key={`${group}-${brand.name}`} className={`home-brand-logo home-brand-logo--${brand.slug}`}>
                      <img
                        src={brand.logo}
                        alt={group === 0 ? brand.name : ''}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = 'none';
                          event.currentTarget.nextElementSibling?.removeAttribute('hidden');
                        }}
                      />
                      <span hidden>{brand.short}</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-reviews-section">
          <div className="home-section-heading">
            <h2>Advice that stays with the order.</h2>
            <p>Customers consistently mention practical product guidance, bat selection, and responsive service.</p>
          </div>
          <TestimonialsCarousel />
        </section>

        <section className="home-help-section">
          <div>
            <h2>Not sure which gear fits your game?</h2>
            <p>Tell SPORTSFOLIO what you play, your level, and your budget. The team can help narrow the catalog before you order.</p>
          </div>
          <div className="home-help-actions">
            <button className="btn-neon" onClick={() => showPage('contact')}>Get product help</button>
            <button className="home-dark-link" onClick={() => showPage('shop')}>Browse all gear</button>
          </div>
        </section>
      </main>
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
  const testimonial = testimonialData[index];

  function showPrevious() {
    setIndex(current => (current - 1 + testimonialData.length) % testimonialData.length);
  }

  function showNext() {
    setIndex(current => (current + 1) % testimonialData.length);
  }

  return (
    <div className="home-testimonial" aria-live="polite">
      <blockquote>
        <p>{testimonial.text}</p>
        <div className="home-review-author">
          <span className="home-review-avatar" aria-hidden="true">{testimonial.initials}</span>
          <span>
            <strong>{testimonial.name}</strong>
            <small>{testimonial.role}</small>
          </span>
        </div>
      </blockquote>
      <div className="home-review-controls">
        <span>{index + 1} / {testimonialData.length}</span>
        <div>
          <button onClick={showPrevious} aria-label="Previous customer review">&larr;</button>
          <button onClick={showNext} aria-label="Next customer review">&rarr;</button>
        </div>
      </div>
    </div>
  );
}
