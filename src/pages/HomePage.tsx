import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductQuickView from '../components/ProductQuickView';
import { getProductCategoryLabel, HERO_GAME_CATEGORIES, productMatchesCategory } from '../data/catalog';
import type { Product } from '../data/products';

const brands = [
  { name: 'SS Cricket', slug: 'ss', short: 'SS', logo: '/images/brands/ss-cricket.png' },
  { name: 'SG Sports', slug: 'sg', short: 'SG', logo: '/images/brands/sg-sports.png' },
  { name: 'MRF', slug: 'mrf', short: 'MRF', logo: '/images/brands/mrf.png' },
  { name: 'Gray-Nicolls', slug: 'gray-nicolls', short: 'GN', logo: '/images/brands/gray-nicolls.png' },
  { name: 'Kookaburra', slug: 'kookaburra', short: 'KB', logo: '/images/brands/kookaburra.png' },
  { name: 'GM Cricket', slug: 'gm', short: 'GM', logo: '/images/brands/gm-cricket.png' },
  { name: 'Puma Cricket', slug: 'puma', short: 'PUMA', logo: '/images/brands/puma-cricket.png' },
  { name: 'DSC', slug: 'dsc', short: 'DSC', logo: '/images/brands/dsc.png' },
];

const categoryShowcase = [
  { value: 'bats', label: 'Cricket bats', detail: 'English willow, Kashmir willow and tape-ball bats', image: '/images/products/bat-english-willow-mrf-gold.webp', layout: 'hero' },
  { value: 'protection', label: 'Protection', detail: 'Helmets, guards and batting pads', image: '/images/products/protective-helmets-shrey-helmet.webp', layout: 'standard' },
  { value: 'balls', label: 'Match balls', detail: 'Leather, practice and tennis balls', image: '/images/products/balls-sg-club-leather.webp', layout: 'standard' },
  { value: 'jerseys', label: 'Jerseys', detail: 'Match-day colours and teamwear', image: '/images/products/team-sportswear-csk-jersey.webp', layout: 'wide' },
];

const preferredFeaturedImages = [
  '/images/products/protective-helmets-shrey-helmet.webp',
  '/images/products/balls-sg-club-leather.webp',
  '/images/products/team-sportswear-csk-jersey.webp',
  '/images/products/accessories-stumps-sportsfolio-plastic-stump.webp',
];

const cadFormatter = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  currencyDisplay: 'code',
});

export default function HomePage() {
  const { showPage, products, setPresetCategory } = useApp();

  const [heroIndex, setHeroIndex] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

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

  const collections = categoryShowcase.map(collection => {
    const matchingProducts = products.filter(product => productMatchesCategory(product, collection.value));
    return {
      ...collection,
      count: matchingProducts.length,
    };
  });

  const featuredProducts = products
    .filter(product => product.isActive !== false && product.price > 0)
    .sort((a, b) => {
      const aRank = preferredFeaturedImages.indexOf(a.image);
      const bRank = preferredFeaturedImages.indexOf(b.image);
      return (aRank < 0 ? Number.MAX_SAFE_INTEGER : aRank) - (bRank < 0 ? Number.MAX_SAFE_INTEGER : bRank);
    })
    .slice(0, 4);

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
        <section className="home-service-bar" aria-label="Store services">
          <div>
            <strong>Canada-wide delivery</strong>
            <span>Charges confirmed before payment</span>
          </div>
          <div>
            <strong>Secure checkout</strong>
            <span>Payments processed by Stripe</span>
          </div>
          <div>
            <strong>30-day requests</strong>
            <span>Eligible exchange or replacement support</span>
          </div>
        </section>

        <nav className="home-game-nav" aria-label="Shop by game">
          <span>Browse the store</span>
          <div>
            {HERO_GAME_CATEGORIES.map(game => (
              <button key={game.value} onClick={() => shopGameCategory(game.value)}>{game.label}</button>
            ))}
            <button onClick={() => shopGameCategory('volleyball')}>Volleyball</button>
            <button onClick={() => shopGameCategory('awards')}>Awards</button>
            <button onClick={() => shopGameCategory('dtf')}>DTF</button>
          </div>
        </nav>

        <section className="home-shell home-collections">
          <div className="home-heading-row">
            <div>
              <h2>Shop cricket essentials</h2>
              <p>Equipment for training days, match days, and everything between.</p>
            </div>
            <button className="home-inline-link" onClick={() => showPage('shop')}>View the full catalog</button>
          </div>
          <div className="home-collection-grid">
            {collections.map(collection => (
              <button
                key={collection.value}
                className={`home-collection home-collection--${collection.layout}`}
                onClick={() => shopGameCategory(collection.value)}
              >
                <span className="home-collection-copy">
                  <strong>{collection.label}</strong>
                  <small>{collection.detail}</small>
                  <b>{collection.count} {collection.count === 1 ? 'item' : 'items'} <span aria-hidden="true">&rarr;</span></b>
                </span>
                <img src={collection.image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </section>

        <section className="home-cricket-feature">
          <img src="/images/hero/Max_a_A_hyper-realistic_4K.png" alt="Cricket player batting under stadium lights" loading="lazy" />
          <div className="home-cricket-feature-copy">
            <h2>Made for every innings.</h2>
            <p>From first nets to weekend matches, find cricket equipment selected for the way you play.</p>
            <button className="btn-neon" onClick={() => shopGameCategory('cricket')}>Shop cricket</button>
          </div>
        </section>

        <section className="home-shell home-featured-products">
          <div className="home-heading-row">
            <div>
              <h2>Featured equipment</h2>
              <p>A focused selection from the current SPORTSFOLIO catalog.</p>
            </div>
            <button className="home-inline-link" onClick={() => showPage('shop')}>Shop all products</button>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="home-product-grid">
              {featuredProducts.map(product => (
                <article className="home-product" key={product.id}>
                  <button className="home-product-image" onClick={() => setQuickViewProduct(product)} aria-label={`View details for ${product.name}`}>
                    {product.badge && <span>{product.badge}</span>}
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </button>
                  <div className="home-product-copy">
                    <small>{getProductCategoryLabel(product)}</small>
                    <h3><button className="home-product-name" onClick={() => setQuickViewProduct(product)}>{product.name}</button></h3>
                    <strong>{cadFormatter.format(product.price)}</strong>
                    <button onClick={() => shopGameCategory(product.category)}>
                      View {getProductCategoryLabel(product).toLowerCase()} <span aria-hidden="true">&rarr;</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="home-catalog-empty">
              <strong>Loading the catalog</strong>
              <span>Featured equipment will appear here shortly.</span>
            </div>
          )}
        </section>

        <section className="home-brands" aria-labelledby="home-brands-title">
          <div className="home-brands-heading">
            <h2 id="home-brands-title">Trusted names in cricket</h2>
            <p>Leading equipment brands represented across the SPORTSFOLIO catalog.</p>
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

        <section className="home-shell home-reviews-section">
          <div className="home-reviews-heading">
            <h2>Service players remember</h2>
            <p>Customers value practical advice, careful bat selection, and responsive support.</p>
          </div>
          <TestimonialsCarousel />
        </section>

        <section className="home-help-section">
          <div>
            <h2>Need help choosing the right gear?</h2>
            <p>Share your game, playing level, and budget. The SPORTSFOLIO team can help narrow the options.</p>
          </div>
          <div className="home-help-actions">
            <button className="btn-neon" onClick={() => showPage('contact')}>Talk to the team</button>
            <button className="home-dark-link" onClick={() => showPage('shipping')}>Delivery and returns</button>
          </div>
        </section>
        {quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
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
