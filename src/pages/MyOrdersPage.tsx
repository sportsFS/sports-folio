import { CSSProperties, FormEvent, useState } from 'react';
import { useApp } from '../context/AppContext';

type ReturnForm = {
  orderId: string;
  type: 'exchange' | 'replacement';
  reason: string;
};

export default function MyOrdersPage() {
  const { orders, requestReturn, showPage, showToast } = useApp();
  const [returnForm, setReturnForm] = useState<ReturnForm | null>(null);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  async function handleReturnSubmit(event: FormEvent) {
    event.preventDefault();
    if (!returnForm || submittingReturn) return;
    setSubmittingReturn(true);
    const result = await requestReturn(returnForm.orderId, returnForm.type, returnForm.reason);
    setSubmittingReturn(false);
    if (result.success) {
      setReturnForm(null);
      showToast('Request sent', 'The store owner will review your request.');
    } else {
      showToast('Request failed', result.error || 'Please try again.', 'error');
    }
  }

  const statusStyles: Record<string, CSSProperties> = {
    pending: { color: '#b36b00' },
    shipped: { color: '#0877c9' },
    delivered: { color: '#177245' },
    cancelled: { color: '#c43232' },
  };

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="reveal visible" style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            Orders
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            My Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>You haven't placed any orders yet.</p>
            <button onClick={() => showPage('shop')} className="btn-neon" style={{ padding: '12px 28px' }}>
              Start shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.slice().reverse().map(order => {
              const isEditingReturn = returnForm?.orderId === order.id;
              const canRequestReturn = order.paymentStatus === 'paid' && order.status === 'delivered' && !order.returnRequest;
              return (
                <article key={order.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 8, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', padding: '4px 14px', borderRadius: 50, border: '1px solid', ...statusStyles[order.status], opacity: 0.9 }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {order.trackingNumber && (
                    <div style={{ padding: '8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Tracking:</strong> <span style={{ color: '#0877c9', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                    </div>
                  )}

                  {order.shippingAddress && (
                    <div style={{ padding: '8px 0 12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong style={{ color: 'var(--text)' }}>Delivery address:</strong>{' '}
                      {[order.shippingAddress.line1, order.shippingAddress.line2, [order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', '), order.shippingAddress.postalCode, order.shippingAddress.country].filter(Boolean).join(', ')}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>{item.name} x {item.qty}</span>
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.shippingAmount !== undefined && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>Canada delivery</span>
                        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{order.shippingAmount === 0 ? 'Free' : `$${order.shippingAmount.toFixed(2)}`}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem' }}>
                    <span style={{ color: 'var(--text)' }}>Total</span>
                    <span style={{ color: 'var(--neon-dark)' }}>${order.total.toFixed(2)} CAD</span>
                  </div>

                  {order.returnRequest && (
                    <div style={{ marginTop: 18, padding: 16, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--card-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <strong style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{order.returnRequest.type} request</strong>
                        <span style={{ color: 'var(--neon-dark)', fontWeight: 700, textTransform: 'capitalize' }}>{order.returnRequest.status}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8 }}>{order.returnRequest.reason}</p>
                      {order.returnRequest.adminNote && <p style={{ color: 'var(--text)', fontSize: '0.85rem', marginTop: 8 }}><strong>Store note:</strong> {order.returnRequest.adminNote}</p>}
                    </div>
                  )}

                  {canRequestReturn && !isEditingReturn && (
                    <button className="btn-neon" style={{ marginTop: 18, padding: '10px 18px' }} onClick={() => setReturnForm({ orderId: order.id, type: 'replacement', reason: '' })}>
                      Request exchange or replacement
                    </button>
                  )}

                  {canRequestReturn && isEditingReturn && returnForm && (
                    <form onSubmit={handleReturnSubmit} style={{ marginTop: 18, display: 'grid', gap: 12, padding: 16, border: '1px solid var(--card-border)', borderRadius: 8 }}>
                      <label style={{ display: 'grid', gap: 6, color: 'var(--text)', fontWeight: 700, fontSize: '0.85rem' }}>
                        Resolution requested
                        <select value={returnForm.type} onChange={event => setReturnForm(current => current ? { ...current, type: event.target.value as ReturnForm['type'] } : current)} style={{ minHeight: 42, border: '1px solid var(--card-border)', borderRadius: 6, background: 'var(--card-bg)', color: 'var(--text)', padding: '0 10px', font: 'inherit' }}>
                          <option value="replacement">Replacement</option>
                          <option value="exchange">Exchange</option>
                        </select>
                      </label>
                      <label style={{ display: 'grid', gap: 6, color: 'var(--text)', fontWeight: 700, fontSize: '0.85rem' }}>
                        Reason
                        <textarea required minLength={10} maxLength={1000} rows={4} value={returnForm.reason} onChange={event => setReturnForm(current => current ? { ...current, reason: event.target.value } : current)} placeholder="Describe the issue and the item you want exchanged or replaced." style={{ border: '1px solid var(--card-border)', borderRadius: 6, background: 'var(--card-bg)', color: 'var(--text)', padding: 10, font: 'inherit', resize: 'vertical' }} />
                      </label>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>Requests are reviewed by the store owner. No cash refunds except where required by law.</p>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <button type="submit" className="btn-neon" disabled={submittingReturn} style={{ padding: '10px 18px' }}>{submittingReturn ? 'Sending...' : 'Send request'}</button>
                        <button type="button" onClick={() => setReturnForm(null)} disabled={submittingReturn} style={{ padding: '10px 18px', border: '1px solid var(--card-border)', borderRadius: 6, background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
