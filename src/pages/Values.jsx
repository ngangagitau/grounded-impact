// pages/Values.js
import React from 'react';

const Values = ({ content }) => {
  const values = content?.values || [];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>{content?.badge || 'What We Stand For'}</div>
          <h2>{content?.title || 'Our Values — GROUND'}</h2>
          <p>{content?.intro || 'Six principles that shape every engagement'}</p>
        </div>
      </div>
      <section className="section section-dark">
        <div className="container">
          <div className="ground-grid">
            {values.map((item, i) => (
              <div className="ground-item" key={i}>
                <div className="ground-letter">{item.letter}</div>
                <span className="ground-word">{item.word}</span>
                <p className="ground-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="vm-grid">
        <div className="vm-item">
          <div className="vm-eyebrow">Vision</div>
          <div className="vm-text">"{content?.vision || 'The preferred provider of healthcare advisory services in Africa.'}"</div>
        </div>
        <div className="vm-item">
          <div className="vm-eyebrow">Tagline</div>
          <div className="vm-text" style={{ color: '#C9A84C' }}>"{content?.tagline || 'Superior services grounded in clinical relevance.'}"</div>
        </div>
      </div>
    </>
  );
};

export default Values;