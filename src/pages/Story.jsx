// pages/Story.js
import React from 'react';

const Story = ({ content }) => {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>{content?.badge || 'The Problem We Solve'}</div>
          <h2>{content?.title || 'Our Story — Cast Down Your Buckets'}</h2>
          <p>{content?.intro || 'Why Grounded Impact exists, and why it matters now'}</p>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="story-grid">
            <div>
              <p className="story-pull">"Strategy and operations are being left to those who have lost touch with frontline patient care."</p>
              <p className="story-body">{content?.leftText || 'The devolution of health in Kenya has heralded significant political noise around facilities management and HRH unrests. Senior clinical professionals are retreating from the boardroom.'}</p>
              <p className="story-body">What fills that vacuum? Strategy, operations, and tactics left to non-clinicians, junior medics, or senior generalists who have lost touch with frontline patient care. These may not command peer respect among specialists.</p>
            </div>
            <div>
              <p className="story-body">{content?.rightText || 'Strategic planning and organisational design consultancies operate on filtered information. They gather data from clinicians who are barely available — because they are in clinics, theatres, and ward rounds.'}</p>
              <div className="story-highlight">
                <div className="story-highlight-title">{content?.highlightTitle || 'The Grounded Impact difference'}</div>
                <p>{content?.highlightBody || 'We are clinicians first. We have stood at the bedside, sat in the boardroom, led through crises. When we advise a hospital, we do not need the information filtered — we understand the unfiltered version.'}</p>
              </div>
              <p className="story-body">The name Grounded Impact carries a dual meaning: advice grounded in lived clinical reality, delivered to produce measurable, lasting impact. Just as an anchor holds a vessel steady against the current.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Story;