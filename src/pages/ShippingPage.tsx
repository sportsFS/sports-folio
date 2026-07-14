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
          Shipping, Exchange &amp; Replacement Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 40 }}>
          Last Updated: July 13, 2026
        </p>

        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Shipping Policy
          </h2>

          <Section title="1. Processing Time">
            <p>Orders are processed within <strong>1-2 business days</strong> after payment confirmation. Orders placed on weekends or public holidays will be processed on the next business day.</p>
          </Section>

          <Section title="2. Shipping Methods and Rates">
            <p>Delivery is available only to Canadian addresses. The delivery charge is displayed in CAD at checkout before payment.</p>
            <ul>
              <li><strong>Canada delivery:</strong> $9.99 CAD for orders of $99 CAD or less</li>
              <li><strong>Free Canada delivery:</strong> Orders over $99 CAD</li>
              <li>The store owner will confirm the expected delivery timing after the order is received</li>
            </ul>
          </Section>

          <Section title="3. Order Tracking">
            <p>When your order is prepared for delivery, you will receive an order update by email. Tracking or delivery-reference information will be provided when available.</p>
          </Section>

          <Section title="4. Shipping Restrictions">
            <ul>
              <li>We currently deliver only to addresses within <strong>Canada</strong></li>
              <li>A complete Canadian street address and postal code must be provided during Stripe Checkout</li>
              <li>Orders cannot be completed using a delivery address outside Canada</li>
            </ul>
          </Section>

          <Section title="5. Delayed or Lost Packages">
            <ul>
              <li>Delivery timing may be affected by weather, access restrictions, or other circumstances outside our control</li>
              <li>If your order has not arrived within the confirmed timeframe, contact us at <strong>hello@sportsfolio.store</strong></li>
            </ul>
          </Section>

          <Section title="6. Incorrect Address">
            <p>Please ensure your shipping address is correct at checkout. We are not responsible for orders delivered to an incorrect address provided by the customer. If you notice an error immediately after placing an order, contact us right away and we will do our best to correct it.</p>
          </Section>

          <hr style={{ border: 'none', borderTop: '2px solid var(--neon)', margin: '48px 0' }} />

          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 20, color: 'var(--text)' }}>
            Exchange, Replacement &amp; Cancellation Policy
          </h2>

          <Section title="7. Order Cancellation">
            <ul>
              <li>Unpaid checkout sessions expire automatically and do not become confirmed orders</li>
              <li>Paid orders cannot be cancelled through the website</li>
              <li>Contact us immediately if you need help before an order is dispatched; we cannot guarantee that fulfilment can be stopped</li>
              <li>After delivery, eligible items may be submitted for an exchange or replacement under the process below</li>
            </ul>
          </Section>

          <Section title="8. Return Eligibility">
            <p>We accept exchange or replacement requests within <strong>30 days</strong> of delivery for most items. To be eligible:</p>
            <ul>
              <li>Items must be unused, unworn, and in their original packaging</li>
              <li>Protective gear (helmets, gloves, pads) must be in hygienic condition</li>
              <li>Customized or personalized items are not eligible for return unless defective</li>
              <li>Clearance or final sale items are not eligible for return</li>
            </ul>
          </Section>

          <Section title="9. How to Request an Exchange or Replacement">
            <ol style={{ paddingLeft: 20 }}>
              <li>Open <strong>My Orders</strong> within 30 days of delivery</li>
              <li>Select the delivered order and choose exchange or replacement</li>
              <li>Describe the item and reason for the request</li>
              <li>Wait for the store owner to approve the request and provide return instructions</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Return the item using the approved instructions</li>
            </ol>
          </Section>

          <Section title="10. Exchange and Replacement Resolution">
            <ul>
              <li>Requests are reviewed before a return is accepted</li>
              <li>Approved items are exchanged or replaced after they are received and inspected</li>
              <li><strong>No cash refunds except where required by law</strong></li>
              <li>You are responsible for return shipping costs unless the item is defective or incorrect</li>
              <li>Exchange and replacement availability depends on current inventory</li>
            </ul>
          </Section>

          <Section title="11. Damaged or Defective Items">
            <p>If you receive a damaged, defective, or incorrect item, submit a replacement request from <strong>My Orders</strong> and contact us at <strong>hello@sportsfolio.store</strong> with your order number and photos. We will arrange an eligible replacement or exchange and cover the reasonable return cost.</p>
          </Section>

          <Section title="12. Exchanges and Replacements">
            <p>Approved exchanges and replacements are subject to product availability. If the requested item is unavailable, the store owner will contact you to agree on another eligible exchange or replacement. No cash refunds are provided except where required by law.</p>
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
