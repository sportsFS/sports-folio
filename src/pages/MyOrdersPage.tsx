import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function MyOrdersPage() {
  const { orders, cancelOrder, showPage, showToast } = useApp();
  const [cancelling, setCancelling] = useState<string | null>(null);

  async function handleCancel(id: string) {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(id);
    const result = await cancelOrder(id);
    setCancelling(null);
    if (result.success) {
      showToast('Order Cancelled', 'Your order has been cancelled');
    } else {
      showToast('Error', result.error || 'Failed to cancel');
    }
  }

  const statusStyles: Record<string, React.CSSProperties> = {
    pending: { color: '#f59e0b' },
    shipped: { color: '#3b82f6' },
    delivered: { color: '#22c55e' },
    cancelled: { color: '#ef4444' },
  };

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh' }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="reveal visible" style={{ marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)', borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
            📋 Orders
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>
            My Orders
          </h2>
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: 16 }}>You haven't placed any orders yet</p>
            <button onClick={() => showPage('shop')} className="btn-neon" style={{ padding: '12px 28px' }}>
              Start Shopping →
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.slice().reverse().map(order => (
              <div key={order.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.95rem' }}>
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', padding: '4px 14px', borderRadius: 50, border: '1px solid', ...statusStyles[order.status], opacity: 0.9 }}>
                      {order.status.toUpperCase()}
                    </span>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancelling === order.id}
                        style={{
                          padding: '6px 16px', borderRadius: 50, border: '1px solid #ef4444',
                          background: 'transparent', color: '#ef4444', cursor: 'pointer',
                          fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.8rem',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                      >
                        {cancelling === order.id ? 'CANCELLING...' : 'CANCEL'}
                      </button>
                    )}
                  </div>
                </div>

                {order.trackingNumber && (
                  <div style={{ padding: '8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <strong>Tracking:</strong>{' '}
                    <span style={{ color: '#0088FF', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 12 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span>{item.name} × {item.qty}</span>
                      <span style={{ color: 'var(--text)', fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem' }}>
                  <span style={{ color: 'var(--text)' }}>Total</span>
                  <span style={{ color: 'var(--neon-dark)' }}>${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
