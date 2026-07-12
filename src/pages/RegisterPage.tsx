import { SignUp, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { isSignedIn } = useUser();
  const { showPage, user, authError, logout } = useApp();

  useEffect(() => {
    if (isSignedIn && user) showPage('home');
  }, [isSignedIn, showPage, user]);

  if (isSignedIn && !user && authError) {
    return (
      <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 440, padding: 24, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>Account sync failed</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
            Your account was created, but the store could not connect it to the backend. Please try again.
          </p>
          <p style={{ color: '#b00020', fontSize: 13, marginBottom: 20 }}>{authError}</p>
          <button className="btn-neon" type="button" onClick={() => void logout()}>
            Sign out and retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <SignUp routing="hash" signInUrl="/login" />
      </div>
    </div>
  );
}
