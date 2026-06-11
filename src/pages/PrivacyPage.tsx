import { useApp } from '../context/AppContext';

export default function PrivacyPage() {
  const { showPage } = useApp();

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
          background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
          borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
          textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
        }}>
          Legal
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>
          Last Updated: May 25, 2026
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <Section title="1. Information We Collect">
            <p>When you use Sports Folio Store, we may collect the following information:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and billing details provided during registration or checkout.</li>
              <li><strong>Order Information:</strong> Products purchased, order history, payment details (processed securely via third-party payment gateways — we do not store full payment card numbers).</li>
              <li><strong>Account Credentials:</strong> Password hash used for authentication via our backend.</li>
              <li><strong>Usage Data:</strong> Pages visited, products viewed, search queries, and interactions with our site to improve your experience.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use your information to:</p>
            <ul>
              <li>Process and fulfill your orders (including shipping confirmations and updates)</li>
              <li>Send transactional emails — order confirmations, shipment/delivery notifications, and cancellation receipts via <strong>Resend</strong></li>
              <li>Send OTP codes for account registration and password resets</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our website, products, and services</li>
              <li>Detect and prevent fraudulent or unauthorized activity</li>
              <li>Comply with legal obligations</li>
            </ul>
          </Section>

          <Section title="3. Data Storage and Security">
            <p>Your data is stored securely using <strong>Convex</strong>, a real-time backend platform. We implement industry-standard security measures including:</p>
            <ul>
              <li>Passwords are hashed with PBKDF2/SHA-256 and never stored in plain text</li>
              <li>All data transmission uses encrypted connections (HTTPS)</li>
              <li>Database access is restricted to authorized services only</li>
              <li>Your session is stored locally on your device and cleared on logout</li>
            </ul>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services to operate our store:</p>
            <ul>
              <li><strong>Convex</strong> — Database and authentication (data stored in US-based servers)</li>
              <li><strong>Resend</strong> — Transactional email delivery (OTP codes, order updates, password resets)</li>
              <li><strong>Vercel</strong> — Website hosting and CDN</li>
              <li><strong>Stripe</strong> — Payment processing (we never see or store full card details)</li>
            </ul>
            <p>Each third party has its own privacy policy and data handling practices. We encourage you to review them.</p>
          </Section>

          <Section title="5. Your Rights">
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the data we hold about you</li>
              <li><strong>Correction:</strong> Request updates to inaccurate or incomplete data</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
            </ul>
            <p>To exercise these rights, contact us at <strong>hello@sportsfolio.store</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="6. Data Retention">
            <p>We retain your personal data for as long as your account is active or as needed to provide services. Order records are retained for legal and tax purposes for the period required by applicable law. You may request deletion of your account at any time.</p>
          </Section>

          <Section title="7. Cookies">
            <p>Our site may use essential cookies required for basic functionality (e.g., maintaining your session and cart). We do not currently use tracking or analytics cookies. If we add such features in the future, we will update this policy and provide a cookie consent mechanism.</p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>Our services are not directed to individuals under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us so we can delete it.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> hello@sportsfolio.store</li>
              <li><strong>Phone:</strong> +1 519-588-5307</li>
              <li><strong>Address:</strong> 101-1025 King Street East, Cambridge, ON N3H 3P5, Canada</li>
            </ul>
          </Section>
        </div>

        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <button className="btn-neon" onClick={() => showPage('home')}>
            Back to Home
          </button>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
        {title}
      </h2>
      <div style={{ marginBottom: 8 }}>{children}</div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', marginTop: 24 }} />
    </div>
  );
}
