import { useApp } from '../context/AppContext';

export default function NotFoundPage() {
  const { showPage } = useApp();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', padding: 40, textAlign: 'center',
    }}>
      <div style={{
        background: 'var(--card-bg)', border: '1px solid var(--card-border)',
        borderRadius: 24, padding: 48, maxWidth: 480,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏏</div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '3rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
          404
        </h1>
        <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 32, lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="btn-neon" onClick={() => showPage('home')}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
