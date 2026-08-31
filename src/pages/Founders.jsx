// pages/Founder.js
import React from 'react';

const Founder = ({ content }) => {
  const credentials = content?.credentials || [];
  const footerNote = content?.footerNote || '';

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>{content?.badge || 'Our Founder'}</div>
          <h2>{content?.name || 'Dr. Stanley Mwenda Aruyaru'}</h2>
          <p>{content?.role || 'Founder, Grounded Impact'}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="founder-layout">
            <div className="founder-card">
              <div className="founder-avatar"><span>{(content?.name || 'Dr. Stanley Mwenda Aruyaru').split(' ').map(n => n[0]).join('').slice(0,2)}</span></div>
              <div className="founder-name">{content?.name || 'Dr. Stanley Mwenda Aruyaru'}</div>
              <div className="founder-title">{content?.role || 'Founder, Grounded Impact'}</div>
              <div>
                {credentials.map((cred, index) => (
                  <span className="cred-pill" key={index}>{cred}</span>
                ))}
              </div>
              {footerNote && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(201,168,76,0.1)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'pre-line' }}>
                  {footerNote}
                </div>
              )}
            </div>
            <div>
              <p className="founder-bio">{content?.bio1 || 'Dr. Aruyaru started school at age 9 in rural Meru County. He became the first doctor St Cyprian High School ever produced. That origin story is the engine of Grounded Impact — proof that the resources to solve Africa\'s health challenges are already here.'}</p>
              <p className="founder-bio">{content?.bio2 || 'Today, he serves as Chief Medical Officer at PCEA Kikuyu Hospital, overseeing four clinical units and more than 500 staff. As Secretary General of the Surgical Society of Kenya, he drives research capacity-building across East and Central Africa.'}</p>
              <div className="founder-quote">
                <p>{content?.quote || '"If you are good with the tip of the scalpel, you can be good with the tip of the pen."'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Founder;