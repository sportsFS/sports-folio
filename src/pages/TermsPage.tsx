import { useApp } from '../context/AppContext';

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>
          Last Updated: July 13, 2026
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using SPORTSFOLIO ("we", "us", "our"), you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website or services.</p>
          </Section>

          <Section title="2. Eligibility">
            <p>To use our services, you must:</p>
            <ul>
              <li>Be at least 18 years of age, or have parental/guardian consent</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Not use our services for any unlawful or prohibited purpose</li>
            </ul>
          </Section>

          <Section title="3. Account Registration">
            <p>When you create an account, you agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Update your information as needed to keep it accurate</li>
              <li>Be responsible for all activity under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts found to be in violation of these terms.</p>
          </Section>

          <Section title="4. Products and Pricing">
            <ul>
              <li>All prices are listed in <strong>USD ($)</strong> and are subject to change without notice</li>
              <li>We strive to display accurate product descriptions and images, but slight variations may occur</li>
              <li>We reserve the right to limit quantities or refuse orders at our discretion</li>
              <li>In the event of a pricing error, we will notify you and offer the option to confirm the corrected price or cancel the order</li>
            </ul>
          </Section>

          <Section title="5. Orders and Payment">
            <ul>
              <li>By placing an order, you agree to pay the total amount shown at checkout</li>
              <li>Payment is processed securely through our third-party payment gateway</li>
              <li>We reserve the right to cancel any order for reasons including suspected fraud, inaccurate pricing, or stock unavailability</li>
              <li>Order confirmation emails are sent once payment is successfully processed</li>
            </ul>
          </Section>

          <Section title="6. Shipping and Delivery">
            <ul>
              <li>Delivery is available only to complete Canadian addresses collected during Stripe Checkout</li>
              <li>Delivery charges are displayed in USD before payment</li>
              <li>The store owner will provide delivery updates and an expected timeframe after receiving the order</li>
              <li>For complete details, see our <button onClick={() => showPage('shipping')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>Shipping, Exchange &amp; Replacement Policy</button></li>
            </ul>
          </Section>

          <Section title="7. Exchanges and Replacements">
            <ul>
              <li>Paid orders cannot be cancelled through the website</li>
              <li>Eligible exchange or replacement requests must be submitted within 30 days of delivery</li>
              <li>Items must meet the eligibility and inspection requirements in our policy</li>
              <li><strong>No cash refunds except where required by law</strong></li>
              <li>For complete details, see our <button onClick={() => showPage('shipping')} style={{ background: 'none', border: 'none', color: 'var(--neon-dark)', textDecoration: 'underline', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', padding: 0 }}>Shipping, Exchange &amp; Replacement Policy</button></li>
            </ul>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content on this website — including product images, logos, text, graphics, and software — is the property of SPORTSFOLIO or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.</p>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>SPORTSFOLIO shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products. Our total liability for any claim shall not exceed the amount you paid for the specific product giving rise to the claim.</p>
          </Section>

          <Section title="10. User Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>Use our site for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Submit false or misleading information</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>
          </Section>

          <Section title="11. Termination">
            <p>We reserve the right to suspend or terminate your access to our services at any time, without prior notice, for conduct that we believe violates these Terms & Conditions or is harmful to other users, us, or third parties.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada. Any disputes arising from these terms shall be resolved in the courts of Ontario, Canada.</p>
          </Section>

          <Section title="13. Changes to Terms">
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the site after changes constitutes acceptance of the new terms. We will notify registered users of material changes via email.</p>
          </Section>

          <Section title="14. Contact">
            <p>For questions about these Terms & Conditions, please contact us:</p>
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
