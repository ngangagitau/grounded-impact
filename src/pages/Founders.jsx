// pages/Founder.js
import React from 'react';

const Founder = () => {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>Our Founder</div>
          <h2>Dr. Stanley Mwenda Aruyaru</h2>
          <p>The Village Surgeon — Consultant · CMO · Author · Advocate · Speaker</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="founder-layout">
            <div className="founder-card">
              <div className="founder-avatar"><span>SA</span></div>
              <div className="founder-name">Dr. Stanley Mwenda Aruyaru</div>
              <div className="founder-title">Founder, Grounded Impact</div>
              <div>
                <span className="cred-pill">MBChB</span>
                <span className="cred-pill">MMed Surgery</span>
                <span className="cred-pill">FCS</span>
                <span className="cred-pill">FACS</span>
                <span className="cred-pill">FeHSM</span>
                <span className="cred-pill">PhD Candidate</span>
              </div>
              <div className="top40-badge">BD Top 40 Under 40 · #9 · 2021</div>
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(201,168,76,0.1)', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                CMO — PCEA Kikuyu Hospital<br />Secretary General — Surgical Society of Kenya
              </div>
            </div>
            <div>
              <p className="founder-bio">Dr. Aruyaru started school at age 9 in rural Meru County. He became the first doctor St Cyprian High School ever produced. That origin story is the engine of Grounded Impact — proof that the resources to solve Africa's health challenges are already here.</p>
              <p className="founder-bio">Today, he serves as Chief Medical Officer at PCEA Kikuyu Hospital, overseeing four clinical units and more than 500 staff. As Secretary General of the Surgical Society of Kenya, he drives research capacity-building across East and Central Africa.</p>
              <div className="founder-quote">
                <p>"If you are good with the tip of the scalpel, you can be good with the tip of the pen."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Founder;