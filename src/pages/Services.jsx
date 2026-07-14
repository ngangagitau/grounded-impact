// pages/Services.js
import React from 'react';

const Services = ({ content }) => {
  const groups = content?.groups || [];

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>{content?.badge || 'What We Offer'}</div>
          <h2>{content?.title || 'Our Services'}</h2>
          <p>{content?.intro || 'Tailored solutions for individuals, hospitals, and companies'}</p>
        </div>
      </div>

      {groups.map((group, groupIndex) => (
        <section className={`section ${groupIndex % 2 === 1 ? 'section-alt' : ''}`} key={groupIndex}>
          <div className="container">
            <div className="section-badge">{group.title}</div>
            <h2 className="section-title">{group.heading}</h2>
            {group.items.map((item, i) => (
              <div className="svc-item" key={i}>
                <div className="svc-num">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
};

export default Services;