import { SignUp, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const { isSignedIn } = useUser();
  const { showPage, user } = useApp();

  useEffect(() => {
    if (isSignedIn && user) showPage('home');
  }, [isSignedIn, showPage, user]);

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <SignUp routing="path" path="/register" signInUrl="/login" />
      </div>
    </div>
  );
}
