import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function ContactPage() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });

  useEffect(() => {
    function triggerReveals() {
      document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
      });
    }
    triggerReveals();
    window.addEventListener('scroll', triggerReveals);
    return () => window.removeEventListener('scroll', triggerReveals);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast('Message Sent! 🎉', "We'll get back to you within 24 hours");
    setForm({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '14px 18px',
    border: '2px solid var(--card-border)', borderRadius: 12,
    background: 'var(--input-bg)', color: 'var(--text)',
    fontSize: '0.95rem', fontFamily: 'Space Grotesk, sans-serif',
    transition: 'border-color 0.3s ease', outline: 'none',
  };

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ padding: '60px 40px 100px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 48,
        }}>
          {/* Info */}
          <div className="reveal" style={{ padding: '40px 0' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
              background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
              borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
              textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
            }}>
              📞 Contact
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
              Get in Touch
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
              Have questions about our products, orders, or need expert advice on choosing the right cricket gear? We're here to help!
            </p>

            {[
              { icon: '📍', title: 'Our Store', lines: ['42, MG Road, Bengaluru,', 'Karnataka 560001, India'] },
              { icon: '📧', title: 'Email Us', lines: ['hello@sportsfolio.store', 'support@sportsfolio.store'] },
              { icon: '📱', title: 'Call Us', lines: ['+91 98765 43210', 'Mon - Sat: 9AM - 9PM IST'] },
              { icon: '💬', title: 'Live Chat', lines: ['Available 24/7 for instant support'] },
            ].map(detail => (
              <div key={detail.title} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
                <div style={{
                  width: 50, height: 50, background: 'rgba(170,255,0,0.1)',
                  borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.3rem', flexShrink: 0,
                }}>
                  {detail.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>{detail.title}</h4>
                  {detail.lines.map((l, i) => (
                    <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="reveal" style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: 24, padding: 40,
          }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.3rem', fontWeight: 700, marginBottom: 28, color: 'var(--text)' }}>
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    First Name
                  </label>
                  <input
                    style={inputStyle}
                    type="text" placeholder="John" required
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Last Name
                  </label>
                  <input
                    style={inputStyle}
                    type="text" placeholder="Doe" required
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Email Address
                </label>
                <input
                  style={inputStyle}
                  type="email" placeholder="john@example.com" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Subject
                </label>
                <select
                  style={{ ...inputStyle }}
                  required
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                >
                  <option value="">Select a topic</option>
                  <option>Product Inquiry</option>
                  <option>Order Status</option>
                  <option>Returns & Exchanges</option>
                  <option>Technical Support</option>
                  <option>Bulk Orders</option>
                  <option>Other</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Your Message
                </label>
                <textarea
                  style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
                  placeholder="Tell us how we can help you..." required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
              </div>

              <button type="submit" className="btn-neon" style={{ width: '100%' }}>
                SEND MESSAGE 🚀
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
