import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { register, showPage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error!);
    } else {
      showPage('home');
    }
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px' }}>
        <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            🏏 Join
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Join Sports Folio and start shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="reveal visible auth-form" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
          {error && (
            <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF3333', fontSize: '0.85rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
          </div>

          <button type="submit" className="btn-neon" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button onClick={() => showPage('login')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', textDecoration: 'underline' }}>
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
