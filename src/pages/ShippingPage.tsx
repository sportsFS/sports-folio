import { useApp } from '../context/AppContext';

export default function ShippingPage() {
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
          Policies
        </div>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>
          Shipping & Returns Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>
          Last Updated: May 25, 2026
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Shipping Policy
          </h2>

          <Section title="1. Processing Time">
            <p>Orders are processed within <strong>1-2 business days</strong> after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
          </Section>

          <Section title="2. Shipping Methods and Rates">
            <p>Shipping costs and estimated delivery times are calculated and displayed at checkout based on your location and selected shipping method.</p>
            <ul>
              <li><strong>Standard Shipping:</strong> 5-8 business days — Calculated at checkout</li>
              <li><strong>Express Shipping:</strong> 2-3 business days — Calculated at checkout</li>
            </ul>
          </Section>

          <Section title="3. Order Tracking">
            <p>Once your order is shipped, you will receive a shipment confirmation email with tracking information. You can use this tracking number to monitor your package's delivery progress.</p>
          </Section>

          <Section title="4. Shipping Restrictions">
            <ul>
              <li>We currently ship to addresses within <strong>Canada and the United States</strong></li>
              <li>We do not ship to PO Boxes or APO/FPO addresses</li>
              <li>International customers are responsible for any customs duties, taxes, or import fees</li>
              <li>We reserve the right to refuse shipping to certain addresses</li>
            </ul>
          </Section>

          <Section title="5. Delayed or Lost Packages">
            <ul>
              <li>We are not responsible for delays caused by shipping carriers, weather, or customs clearance</li>
              <li>If your package has not arrived within the estimated timeframe, please contact the carrier directly with your tracking number</li>
              <li>If your package is lost in transit, contact us at <strong>hello@sportsfolio.store</strong> and we will assist with a resolution</li>
            </ul>
          </Section>

          <Section title="6. Incorrect Address">
            <p>Please ensure your shipping address is correct at checkout. We are not responsible for orders delivered to an incorrect address provided by the customer. If you notice an error immediately after placing an order, contact us right away and we will do our best to correct it.</p>
          </Section>

          <hr style={{ border: 'none', borderTop: '2px solid var(--neon)', margin: '48px 0' }} />

          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Returns &amp; Cancellation Policy
          </h2>

          <Section title="7. Order Cancellation">
            <ul>
              <li>Orders can be cancelled only while in <strong>pending</strong> status (before shipment)</li>
              <li>To cancel, go to <strong>My Orders</strong> in your account and click the Cancel button</li>
              <li>Once an order has been <strong>shipped</strong> or <strong>delivered</strong>, it cannot be cancelled through the website</li>
              <li>For assistance with shipped orders, contact our support team</li>
              <li>A cancellation confirmation email will be sent to your registered email address</li>
            </ul>
          </Section>

          <Section title="8. Return Eligibility">
            <p>We accept returns within <strong>30 days</strong> of delivery for most items. To be eligible for a return:</p>
            <ul>
              <li>Items must be unused, unworn, and in their original packaging</li>
              <li>Protective gear (helmets, gloves, pads) must be in hygienic condition</li>
              <li>Customized or personalized items are not eligible for return unless defective</li>
              <li>Clearance or final sale items are not eligible for return</li>
            </ul>
          </Section>

          <Section title="9. How to Initiate a Return">
            <ol style={{ paddingLeft: 20 }}>
              <li>Contact us at <strong>hello@sportsfolio.store</strong> within 30 days of delivery</li>
              <li>Provide your order number and the item(s) you wish to return</li>
              <li>We will provide a return authorization and shipping instructions</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item back using the provided instructions</li>
            </ol>
          </Section>

          <Section title="10. Refund Processing">
            <ul>
              <li>Once we receive and inspect your return, we will notify you of the approval or rejection</li>
              <li>Approved refunds will be processed to the original payment method within <strong>5-10 business days</strong></li>
              <li>Shipping costs are non-refundable unless the return is due to our error or a defective item</li>
              <li>You are responsible for return shipping costs unless the item is defective or incorrect</li>
            </ul>
          </Section>

          <Section title="11. Damaged or Defective Items">
            <p>If you receive a damaged or defective item, please contact us immediately at <strong>hello@sportsfolio.store</strong> with your order number and photos of the damage. We will arrange a replacement or full refund, including return shipping costs.</p>
          </Section>

          <Section title="12. Exchanges">
            <p>We currently do not offer direct exchanges. If you need a different size or product, please return the original item for a refund and place a new order.</p>
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
      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.05rem', fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
        {title}
      </h3>
      <div style={{ marginBottom: 8 }}>{children}</div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', marginTop: 24 }} />
    </div>
  );
}
