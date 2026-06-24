import { SignUp, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { isSignedIn } = useUser();
  const { showPage } = useApp();

  useEffect(() => {
    if (isSignedIn) showPage('home');
  }, [isSignedIn, showPage]);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash.startsWith('#sign-in')) showPage('login');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [showPage]);

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <SignUp routing="hash" signInUrl="#sign-in" />
      </div>
    </div>
  );
}
