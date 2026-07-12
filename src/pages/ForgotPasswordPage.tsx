import { SignIn } from '@clerk/react';

export default function ForgotPasswordPage() {
  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 440, padding: '40px 20px', display: 'flex', justifyContent: 'center' }}>
        <SignIn routing="path" path="/forgot-password" />
      </div>
    </div>
  );
}
