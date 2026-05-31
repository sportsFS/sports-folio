import { useEffect } from 'react';

export default function ContactPage() {
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

  return (
    <div style={{ paddingTop: 72 }}>
      <section style={{ padding: '60px 40px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div className="reveal">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px',
            background: 'rgba(170,255,0,0.1)', border: '1px solid rgba(170,255,0,0.3)',
            borderRadius: 50, fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-dark)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16,
          }}>
            Contact
          </div>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.2rem', fontWeight: 800, marginBottom: 16, color: 'var(--text)' }}>
            Get in Touch
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
            Have questions about our products, orders, or need expert advice on choosing the right gear? We're here to help!
          </p>
        </div>

        <div className="reveal" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32, marginBottom: 48,
        }}>
          {[
            { icon: '📍', title: 'Our Store', lines: ['101-1025 King Street East,', 'Cambridge, ON N3H 3P5, Canada'] },
            { icon: '📧', title: 'Email Us', lines: ['hello@sportsfolio.store', 'support@sportsfolio.store'] },
            { icon: '📱', title: 'Call Us', lines: ['+1 519-588-5307'] },
            { icon: '🕐', title: 'Store Hours', lines: ['Mon: 11AM–1PM, 3:30–8PM', 'Wed–Thu: 11AM–1PM, 4–8PM', 'Fri: 11AM–8PM', 'Sat–Sun: 12–8PM', 'Tuesday: Closed'] },
          ].map(detail => (
            <div key={detail.title} style={{
              background: 'var(--card-bg)', border: '1px solid var(--card-border)',
              borderRadius: 16, padding: 28,
            }}>
              <div style={{
                width: 50, height: 50, background: 'rgba(170,255,0,0.1)',
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem', marginBottom: 16,
              }}>
                {detail.icon}
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>{detail.title}</h4>
              {detail.lines.map((l, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="reveal" style={{
          background: 'var(--card-bg)', border: '1px solid var(--card-border)',
          borderRadius: 16, padding: 32, textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
            For quick questions, reach us via email or phone. We typically respond within 24 hours.
          </p>
        </div>

        {/* Google Maps */}
        <div className="reveal" style={{ marginTop: 48, borderRadius: 24, overflow: 'hidden', border: '1px solid var(--card-border)' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.2147114822365!2d-80.35577132401217!3d43.393441471115615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b898fabc360df%3A0x7709fedc3ff576a9!2sSportsfolio!5e0!3m2!1sen!2sin!4v1779699366585!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sportsfolio Location"
          />
        </div>
      </section>
    </div>
  );
}
