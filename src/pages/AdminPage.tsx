import { useApp } from '../context/AppContext';
import { allProducts } from '../data/products';

export default function AdminPage() {
  const { user, showPage } = useApp();

  const totalUsers = (() => {
    try {
      return JSON.parse(localStorage.getItem('cricket_users') || '[]').length;
    } catch {
      return 1;
    }
  })();

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="reveal visible" style={{ marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            ⚡ Admin
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            Admin Dashboard
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Welcome back, {user?.name}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20, marginBottom: 48 }}>
          <StatCard icon="📦" label="Total Products" value={allProducts.length} />
          <StatCard icon="👥" label="Registered Users" value={totalUsers} />
          <StatCard icon="🛒" label="Total Orders" value={0} />
          <StatCard icon="⭐" label="Avg Rating" value="4.5" />
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Store Actions
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button className="btn-neon" onClick={() => showPage('shop')}>
              View Products
            </button>
            <button className="btn-outline" onClick={() => showPage('home')}>
              View Store
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: number | string }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 28 }}>
      <div style={{ fontSize: '2rem', marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--neon-dark)', marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</div>
    </div>
  );
}
