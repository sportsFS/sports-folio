import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function ForgotPasswordPage() {
  const { sendResetOtp, resetPassword, showPage } = useApp();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    const result = await sendResetOtp(email);
    setLoading(false);
    if (!result.success) {
      setError(result.error!);
    } else {
      setSent(true);
      setStep('reset');
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!code) { setError('Please enter the reset code'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true);
    const result = await resetPassword(email, code, newPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.error!);
    } else {
      showPage('login');
    }
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px' }}>
        <div className="reveal visible" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            🔑 Reset
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {step === 'email' ? "Enter your email and we'll send a reset code" : `Enter the code sent to ${email}`}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="reveal visible auth-form" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
            {error && (
              <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF3333', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}
            {sent && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#22c55e', fontSize: '0.85rem', fontWeight: 600 }}>
                Reset code sent! Check your email.
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
            </div>

            <button type="submit" className="btn-neon" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? 'SENDING...' : 'SEND RESET CODE →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Remember your password?{' '}
              <button onClick={() => showPage('login')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', textDecoration: 'underline' }}>
                Sign in
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleReset} className="reveal visible auth-form" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 20, padding: 32 }}>
            {error && (
              <div style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#FF3333', fontSize: '0.85rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Reset Code</label>
              <input type="text" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" maxLength={6} className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', textAlign: 'center', letterSpacing: 8, fontWeight: 700 }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 8 characters, letters and numbers" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Confirm New Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter password" className="auth-input" style={{ width: '100%', padding: '12px 16px', border: '2px solid var(--card-border)', borderRadius: 10, background: 'var(--input-bg)', color: 'var(--text)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem' }} />
            </div>

            <button type="submit" className="btn-neon" style={{ width: '100%', padding: '14px' }} disabled={loading || code.length !== 6}>
              {loading ? 'RESETTING...' : 'RESET PASSWORD →'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {"Didn't get the code? "}
              <button onClick={() => { setStep('email'); setSent(false); }} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.85rem', textDecoration: 'underline' }}>
                Send again
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
