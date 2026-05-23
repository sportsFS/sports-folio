import { useState, useEffect, useMemo } from 'react';
import { allProducts } from '../data/products';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

type SortType = 'default' | 'low' | 'high' | 'name';

export default function ShopPage() {
  const [loaded, setLoaded] = useState(false);
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sort, setSort] = useState<SortType>('default');

  // Trigger scroll reveals
  useEffect(() => {
    function triggerReveals() {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
      });
    }
    triggerReveals();
    window.addEventListener('scroll', triggerReveals);
    return () => window.removeEventListener('scroll', triggerReveals);
  }, [loaded]);

  // Skeleton loader
  useEffect(() => {
    setLoaded(false);
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, [category, maxPrice]);

  const filtered = useMemo(() => {
    let result = allProducts.filter(p =>
      (category === 'all' || p.category === category) && p.price <= maxPrice
    );
    if (sort === 'low') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'high') result = [...result].sort((a, b) => b.price - a.price);
    else if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [category, maxPrice, sort]);

  const filterOptions = [
    { label: 'All Products', value: 'all', count: 20 },
    { label: 'Cricket Bats', value: 'bats', count: 6 },
    { label: 'Cricket Balls', value: 'balls', count: 3 },
    { label: 'Protective Gear', value: 'protection', count: 5 },
    { label: 'Footwear', value: 'footwear', count: 3 },
    { label: 'Accessories', value: 'accessories', count: 3 },
  ];

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Header */}
      <section style={{ padding: '60px 40px 40px', textAlign: 'center' }}>
        <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
          🛒 Shop
        </div>
        <h2 className="reveal section-title" style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
          All Cricket Equipment
        </h2>
        <p className="reveal" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
          Browse our complete collection of premium cricket gear
        </p>
      </section>

      {/* Shop Layout */}
      <section style={{ padding: '0 40px 100px' }}>
        <div className="shop-layout-responsive" style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Sidebar */}
          <aside className="shop-sidebar-responsive" style={{ width: 280, flexShrink: 0, position: 'sticky', top: 100 }}>
            {/* Categories Filter */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text)' }}>
                📂 Categories
              </div>
              {filterOptions.map(opt => (
                <div
                  key={opt.value}
                  className={`filter-option ${category === opt.value ? 'active' : ''}`}
                  onClick={() => setCategory(opt.value)}
                >
                  <div className="filter-checkbox">✓</div>
                  <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>{opt.label}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{opt.count}</span>
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text)' }}>💰 Price Range</div>
              <input
                type="range" min={0} max={15000} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>$0</span>
                <span>${maxPrice.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 16, color: 'var(--text)' }}>⭐ Rating</div>
              {['4★ & above', '3★ & above'].map(r => (
                <RatingFilter key={r} label={r} />
              ))}
            </div>

            <button
              className="btn-neon"
              style={{ width: '100%' }}
              onClick={() => { setCategory('all'); setMaxPrice(15000); setSort('default'); }}
            >
              CLEAR ALL FILTERS
            </button>
          </aside>

          {/* Main */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Showing {loaded ? filtered.length : '...'} products
              </div>
              <select value={sort} onChange={e => setSort(e.target.value as SortType)}>
                <option value="default">Sort by: Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {!loaded
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                : filtered.length > 0
                  ? filtered.map(p => <ProductCard key={p.id} product={p} />)
                  : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 20px' }}>
                      <div style={{ fontSize: '4rem', marginBottom: 16, opacity: 0.3 }}>🔍</div>
                      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12, color: 'var(--text)' }}>No Products Found</h3>
                      <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                    </div>
                  )
              }
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @media (max-width: 768px) {
          .shop-layout-responsive { flex-direction: column !important; }
          .shop-sidebar-responsive { width: 100% !important; position: static !important; order: 1 !important; }
          .shop-layout-responsive > div:last-child { order: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function RatingFilter({ label }: { label: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className={`filter-option ${active ? 'active' : ''}`} onClick={() => setActive(a => !a)}>
      <div className="filter-checkbox">✓</div>
      <span style={{ flex: 1, fontSize: '0.9rem', color: 'var(--text)' }}>{label}</span>
    </div>
  );
}
