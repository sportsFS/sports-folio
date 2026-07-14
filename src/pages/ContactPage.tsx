export default function ContactPage() {
  return (
    <div className="contact-page">
      <header className="contact-intro">
        <div>
          <h1>Talk to SPORTSFOLIO</h1>
          <p>Get practical help with product selection, existing orders, exchanges, and store visits.</p>
        </div>
        <a href="mailto:hello@sportsfolio.store">Email the team</a>
      </header>

      <main className="contact-shell">
        <section className="contact-store">
          <div className="contact-section-heading">
            <h2>Visit the store</h2>
            <p>Find SPORTSFOLIO in Cambridge, Ontario.</p>
          </div>

          <address>
            <strong>SPORTSFOLIO</strong>
            <span>101-1025 King Street East</span>
            <span>Cambridge, ON N3H 3P5</span>
            <span>Canada</span>
            <a href="https://www.google.com/maps/search/?api=1&query=Sportsfolio%201025%20King%20Street%20East%20Cambridge%20ON" target="_blank" rel="noreferrer">Open in Google Maps</a>
          </address>

          <div className="contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.2147114822365!2d-80.35577132401217!3d43.393441471115615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b898fabc360df%3A0x7709fedc3ff576a9!2sSportsfolio!5e0!3m2!1sen!2sin!4v1779699366585!5m2!1sen!2sin"
              title="SPORTSFOLIO store location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <aside className="contact-details">
          <section className="contact-direct">
            <h2>Contact the team</h2>
            <p>Choose the quickest channel for your question.</p>
            <div>
              <a href="mailto:hello@sportsfolio.store">
                <small>Email</small>
                <strong>hello@sportsfolio.store</strong>
                <span>Product and order support</span>
              </a>
              <a href="tel:+15195885307">
                <small>Phone</small>
                <strong>+1 519-588-5307</strong>
                <span>Call during store hours</span>
              </a>
              <a href="https://wa.me/15195885307" target="_blank" rel="noreferrer">
                <small>WhatsApp</small>
                <strong>Message SPORTSFOLIO</strong>
                <span>Quick product questions</span>
              </a>
            </div>
          </section>

          <section className="contact-hours">
            <h2>Store hours</h2>
            <dl>
              <div><dt>Monday</dt><dd>11AM-1PM, 3:30-8PM</dd></div>
              <div><dt>Tuesday</dt><dd>Closed</dd></div>
              <div><dt>Wednesday-Thursday</dt><dd>11AM-1PM, 4-8PM</dd></div>
              <div><dt>Friday</dt><dd>11AM-8PM</dd></div>
              <div><dt>Saturday-Sunday</dt><dd>12-8PM</dd></div>
            </dl>
          </section>

          <section className="contact-prep">
            <h2>Help us answer faster</h2>
            <ul>
              <li>For product advice, include your sport, level, and budget.</li>
              <li>For order support, include your order number.</li>
              <li>For exchanges or replacements, submit the request from My Orders first.</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
