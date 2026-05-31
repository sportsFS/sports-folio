import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie_consent');
    if (!dismissed) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie_consent', 'declined');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)',
      padding: '20px 24px', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 16, flexWrap: 'wrap',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    }}>
      <p style={{
        color: 'var(--text-secondary)', fontSize: '0.85rem',
        maxWidth: 600, lineHeight: 1.6, margin: 0,
      }}>
        We use essential cookies to make our site work. By continuing to browse, you agree to our use of cookies.
        See our <a href="/privacy" onClick={(e) => { e.preventDefault(); window.location.href = '/?page=privacy'; window.dispatchEvent(new CustomEvent('navigate', { detail: 'privacy' })); }}
          style={{ color: 'var(--neon-dark)', textDecoration: 'underline' }}>Privacy Policy</a>.
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={decline} style={{
          padding: '8px 20px', borderRadius: 50, border: '1px solid var(--card-border)',
          background: 'transparent', color: 'var(--text)', fontSize: '0.8rem',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
        }}>
          Decline
        </button>
        <button onClick={accept} className="btn-neon" style={{
          padding: '8px 20px', fontSize: '0.8rem',
        }}>
          Accept
        </button>
      </div>
    </div>
  );
}
