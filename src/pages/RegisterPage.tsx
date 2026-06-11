import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { sendOtp, verifyOtp, showPage } = useApp();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!agreed) { setError('Please agree to the Privacy Policy and Terms of Service'); return; }
    if (!name || !email || !password || !confirm) { setError('Please fill in all fields'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    const result = await sendOtp(name, email, password);
    setLoading(false);
    if (!result.success) {
      setError(result.error!);
    } else {
      setStep('otp');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!code) { setError('Please enter the verification code'); return; }
    setLoading(true);
    const result = await verifyOtp(email, code);
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
            {step === 'form' ? 'Create Account' : 'Verify Email'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {step === 'form' ? 'Join Sports Folio and start shopping' : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSendOtp} className="reveal visible auth-form" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
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
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters, letters and numbers" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
            </div>

            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" id="agree" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, cursor: 'pointer', accentColor: 'var(--neon-dark)' }} />
              <label htmlFor="agree" style={{ cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the{' '}
                <button type="button" onClick={() => showPage('privacy')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', textDecoration: 'underline', padding: 0 }}>
                  Privacy Policy
                </button>
                {' '}and{' '}
                <button type="button" onClick={() => showPage('terms')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8rem', textDecoration: 'underline', padding: 0 }}>
                  Terms of Service
                </button>
              </label>
            </div>
            <button type="submit" className="btn-neon" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'SENDING OTP...' : 'SEND OTP →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <button onClick={() => showPage('login')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', textDecoration: 'underline' }}>
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="reveal visible auth-form" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
            {error && (
              <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF3333', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Verification Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', textAlign: 'center', letterSpacing: 8, fontWeight: 700 }} />
            </div>

            <button type="submit" className="btn-neon" style={{ width: '100%', padding: '14px' }} disabled={loading || code.length !== 6}>
              {loading ? 'VERIFYING...' : 'VERIFY & CREATE ACCOUNT →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {"Didn't get the code? "}
              <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', textDecoration: 'underline' }}>
                Go back
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
