// pages/Contact.js
import React, { useRef } from 'react';

const Contact = ({ content }) => {
  const feedbackRef = useRef(null);

  const handleContact = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.cname.value.trim();
    const email = form.cemail.value.trim();
    const service = form.cservice.value;
    const msg = form.cmsg.value.trim();
    const feedback = feedbackRef.current;

    if (!name || !email || !service || !msg) {
      feedback.style.display = 'block';
      feedback.style.color = '#f87171';
      feedback.textContent = '⚠ Please fill in all required fields.';
      return;
    }
    feedback.style.display = 'block';
    feedback.style.color = '#C9A84C';
    feedback.textContent = '✓ Thank you — we will be in touch within 48 hours.';
    form.reset();
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>{content?.badge || 'Get In Touch'}</div>
          <h2>{content?.title || 'Contact Us'}</h2>
          <p>{content?.intro || 'Advisory · Speaking · Corporate wellness · Partnerships'}</p>
        </div>
      </div>
      <section className="section section-dark">
        <div className="container">
          <div className="contact-grid">
            {(content?.contacts || []).map((item, index) => (
              <div className="contact-block" key={index}>
                <div className="contact-block-label">{item.label}</div>
                <div className="contact-block-value">{item.value}</div>
              </div>
            ))}
          </div>
          <div className="contact-form-wrapper">
            <h3>{content?.formTitle || 'Send an Enquiry'}</h3>
            <p>{content?.formIntro || 'Tell us about your organisation and what you need. We respond within 48 hours.'}</p>
            <form onSubmit={handleContact}>
              <div className="form-grid">
                <div>
                  <label htmlFor="cname">Your name *</label>
                  <input id="cname" type="text" placeholder="Full Name" />
                </div>
                <div>
                  <label htmlFor="corg">Organisation *</label>
                  <input id="corg" type="text" placeholder="Hospital / Company" />
                </div>
                <div>
                  <label htmlFor="cemail">Email *</label>
                  <input id="cemail" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label htmlFor="cphone">Phone</label>
                  <input id="cphone" type="tel" placeholder="+254 7__ ___ ___" />
                </div>
                <div className="form-grid-full">
                  <label htmlFor="cservice">Service of interest *</label>
                  <select id="cservice">
                    <option value="">— Select —</option>
                    <option>Entry-Level Hospital Management</option>
                    <option>Executive Coaching</option>
                    <option>Doctors on Board</option>
                    <option>Operational Excellence</option>
                    <option>Workplace Wellness</option>
                    <option>Keynote Speaking</option>
                  </select>
                </div>
                <div className="form-grid-full">
                  <label htmlFor="cmsg">Your message *</label>
                  <textarea id="cmsg" placeholder="How can we help?"></textarea>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Send Enquiry <i className="fas fa-paper-plane"></i>
              </button>
              <div ref={feedbackRef} style={{ fontSize: '14px', marginTop: '12px', display: 'none' }}></div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;