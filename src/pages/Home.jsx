// pages/Home.js
import React from 'react';

const Home = ({ content }) => {
  const hero = content?.hero || {};
  const stats = content?.stats || [];
  const cards = content?.cards || [];
  const about = content?.about || {};

  return (
    <>
      <section className="hero">
        <div className="container">
          <div>
            <div className="section-badge" style={{ color: '#C9A84C' }}>Healthcare Advisory</div>
            <h1>{hero.title || 'Superior Services'} <em>{hero.titleAccent || 'Grounded in Clinical Relevance'}</em></h1>
            <p className="hero-sub">{hero.subtitle}</p>
            <div className="hero-btns">
              <button className="btn btn-primary">{hero.primaryButton || 'Explore Services'} <i className="fas fa-arrow-right"></i></button>
              <button className="btn btn-outline">{hero.secondaryButton || 'Our Story'}</button>
            </div>
          </div>
          <div className="hero-graphic">
            <img src="/Logo.png" alt="Grounded Impact logo" className="hero-logo" />
            <div className="hero-quote">
              <blockquote>"Superior services grounded in clinical relevance"</blockquote>
              <cite>— The Grounded Impact Promise</cite>
            </div>
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="container">
          {stats.map((stat, index) => (
            <div className="stat-item" key={index}><div className="stat-num">{stat.value}</div><div className="stat-label">{stat.label}</div></div>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-badge">Who We Are</div>
          <h2 className="section-title">{about.title}</h2>
          <p className="section-body">{about.body}</p>
          <div className="card-grid">
            {cards.map((card, index) => (
              <div className="card" key={index}><div className="card-icon"><i className={card.icon} style={{ color: '#1B3A6B', fontSize: '20px' }}></i></div><h3>{card.title}</h3><p>{card.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <div className="vm-grid" style={{ background: '#0B2A4A' }}>
        <div className="vm-item"><div className="vm-eyebrow">Vision</div><div className="vm-text">"{content?.vision || 'The preferred provider of healthcare advisory services in Africa.'}"</div></div>
        <div className="vm-item"><div className="vm-eyebrow">Mission</div><div className="vm-text">"{content?.mission || 'To strengthen health systems, amplify the clinician\'s voice, and accelerate safe, quality, equitable healthcare.'}"</div></div>
      </div>
    </>
  );
};

export default Home;