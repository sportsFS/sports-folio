import { SignIn, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { isSignedIn } = useUser();
  const { showPage } = useApp();

  useEffect(() => {
    if (isSignedIn) showPage('home');
  }, [isSignedIn, showPage]);

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <SignIn routing="path" path="/login" signUpUrl="/register" />
      </div>
    </div>
  );
}
