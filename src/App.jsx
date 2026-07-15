// App.js
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// --- Page Components ---
import Home from './pages/Home';
import Story from './pages/Story';
import Services from './pages/Services';
import Values from './pages/Values';
import Founder from './pages/Founders';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Vlogs from './pages/Vlogs';
import { supabase } from './supabaseClient';

const initialSiteContent = {
  siteMeta: {
    topbarLeft: 'Nairobi, Kenya · Healthcare Advisory · Speaking · Wellness',
    topbarRight: 'info@grounded-impact.co.ke',
    brandName: 'Grounded',
    brandAccent: 'Impact',
    brandTagline: 'Superior · Relevant · Grounded',
    footerBrandName: 'Grounded',
    footerBrandAccent: 'Impact',
    footerTagline: '"Superior services grounded in clinical relevance"',
    footerAbout: "Healthcare consultancy founded by Dr. Stanley Mwenda Aruyaru — bringing the clinician's voice back to the boardroom.",
    footerCopy: '© 2025 Grounded Impact. All rights reserved.'
  },
  home: {
    hero: {
      title: 'Superior Services',
      titleAccent: 'Grounded in Clinical Relevance',
      subtitle: "Bringing the clinician's voice back to the boardroom — advisory, leadership, and health communications rooted in 13+ years of frontline surgical and hospital management experience.",
      primaryButton: 'Explore Services',
      secondaryButton: 'Our Story'
    },
    stats: [
      { value: '13+', label: 'Years Clinical' },
      { value: '32K+', label: 'LinkedIn Followers' },
      { value: '7', label: 'Service Pillars' },
      { value: '#9', label: 'Top 40 Under 40' }
    ],
    about: {
      title: "The clinician's voice at the boardroom table",
      body: "Kenya's senior clinicians are running away from the boardroom — leaving strategy to those without frontline clinical insight. Grounded Impact was founded to reverse that. We bring unfiltered, frontline clinical intelligence back to where decisions are made."
    },
    cards: [
      { icon: 'fas fa-heartbeat', title: 'Healthcare Quality Advisory', text: 'Clinical governance, quality audits, and systems strengthening — assessed from the inside.' },
      { icon: 'fas fa-users', title: 'Leadership Development', text: 'Training clinicians to lead — from hospital management to executive coaching for Medical Superintendents.' },
      { icon: 'fas fa-microphone', title: 'Speaking & Communications', text: 'Award-winning keynotes and health communications strategy for professional and public audiences.' }
    ],
    vision: 'The preferred provider of healthcare advisory services in Africa.',
    mission: 'To strengthen health systems, amplify the clinician\'s voice, and accelerate safe, quality, equitable healthcare.'
  },
  story: {
    badge: 'The Problem We Solve',
    title: 'Our Story — Cast Down Your Buckets',
    intro: 'Why Grounded Impact exists, and why it matters now',
    leftText: 'The devolution of health in Kenya has heralded significant political noise around facilities management and HRH unrests. Senior clinical professionals are retreating from the boardroom.',
    rightText: 'Strategic planning and organisational design consultancies operate on filtered information. They gather data from clinicians who are barely available — because they are in clinics, theatres, and ward rounds.',
    highlightTitle: 'The Grounded Impact difference',
    highlightBody: 'We are clinicians first. We have stood at the bedside, sat in the boardroom, led through crises. When we advise a hospital, we do not need the information filtered — we understand the unfiltered version.'
  },
  services: {
    badge: 'What We Offer',
    title: 'Our Services',
    intro: 'Tailored solutions for individuals, hospitals, and companies',
    groups: [
      {
        title: 'For Individuals',
        heading: 'Developing clinical leaders',
        items: [
          { name: 'Training in Entry-Level Hospital Management', desc: 'Structured programme for clinicians transitioning into management.' },
          { name: 'Executive Coaching for Medical Superintendents', desc: 'Practical coaching for clinicians stepping into leadership roles.' },
          { name: 'Peer Mentoring Facilitation', desc: 'Support networks that strengthen leadership confidence and systems thinking.' },
          { name: 'The Effective Medical Superintendent', desc: 'A focused leadership experience for operational excellence.' }
        ]
      },
      {
        title: 'For Hospitals',
        heading: 'Strengthening health systems from within',
        items: [
          { name: 'Operational Clinical Excellence', desc: 'End-to-end clinical operations review and quality systems design.' },
          { name: 'Mentorship & Supportive Supervision Training', desc: 'Hands-on development for supervisors and clinical managers.' },
          { name: 'Organisational Structure & Board Charter', desc: 'Clear governance structures that enable sustainable performance.' },
          { name: 'Healthcare Quality & Accreditation', desc: 'Practical support for facilities aiming for stronger outcomes.' }
        ]
      },
      {
        title: 'For Companies',
        heading: 'Investing in your most important asset',
        items: [
          { name: 'Workplace Wellness Programme', desc: 'Customised employee wellness and occupational health services.' },
          { name: 'In-House Annual Medical Check-Ups', desc: 'Preventive services designed for long-term staff wellbeing.' },
          { name: 'Occupational Safety & Health Assessment', desc: 'Workplace risk reviews that improve care and productivity.' }
        ]
      }
    ]
  },
  values: {
    badge: 'What We Stand For',
    title: 'Our Values — GROUND',
    intro: 'Six principles that shape every engagement',
    values: [
      { letter: 'G', word: 'Global Mindset', desc: 'Applying international best practice to African realities.' },
      { letter: 'R', word: 'Relevance', desc: 'Clinical, local, ethical relevance — actionable solutions.' },
      { letter: 'O', word: 'Outcomes', desc: 'Patient-centric, obsessed with measurable results.' },
      { letter: 'U', word: 'Ubuntu', desc: 'Collaborative practice — knowledge shared multiplies.' },
      { letter: 'N', word: 'Nuance', desc: 'Complex systems resist oversimplification.' },
      { letter: 'D', word: 'Drive', desc: 'Integrity in action — uncompromising dedication.' }
    ],
    vision: 'The preferred provider of healthcare advisory services in Africa.',
    tagline: 'Superior services grounded in clinical relevance.'
  },
  contact: {
    badge: 'Get In Touch',
    title: 'Contact Us',
    intro: 'Advisory · Speaking · Corporate wellness · Partnerships',
    contacts: [
      { label: 'Email', value: 'info@grounded-impact.co.ke' },
      { label: 'Website', value: 'grounded-impact.co.ke' },
      { label: 'LinkedIn', value: '@aruyaru' },
      { label: 'Location', value: 'Nairobi, Kenya' }
    ],
    formTitle: 'Send an Enquiry',
    formIntro: 'Tell us about your organisation and what you need. We respond within 48 hours.'
  }
};

const getStoredSiteContent = () => {
  if (typeof window === 'undefined') return initialSiteContent;
  try {
    const saved = window.localStorage.getItem('grounded-impact-content');
    return saved ? JSON.parse(saved) : initialSiteContent;
  } catch {
    return initialSiteContent;
  }
};

const getStoredVlogs = () => {
  if (typeof window === 'undefined') return [
    { id: 1, title: 'Welcome to Grounded Impact', content: 'Our first vlog — introducing the vision and mission.' }
  ];
  try {
    const saved = window.localStorage.getItem('grounded-impact-vlogs');
    return saved ? JSON.parse(saved) : [{ id: 1, title: 'Welcome to Grounded Impact', content: 'Our first vlog — introducing the vision and mission.' }];
  } catch {
    return [{ id: 1, title: 'Welcome to Grounded Impact', content: 'Our first vlog — introducing the vision and mission.' }];
  }
};

function App() {
  const [activePage, setActivePage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [siteContent, setSiteContent] = useState(getStoredSiteContent);
  const [vlogs, setVlogs] = useState(getStoredVlogs);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I’m Grounded AI. I can help with our services, founder story, values, contact details, and vlogs.' }
  ]);
  const chatEndRef = useRef(null);

  // Supabase Database Syncing States
  const [dbSyncStatus, setDbSyncStatus] = useState('loading'); // 'loading', 'synced', 'local-only', 'unsaved', 'error'
  const [publishStatus, setPublishStatus] = useState('idle'); // 'idle', 'publishing', 'success', 'error'
  const [publishError, setPublishError] = useState('');

  const isLoadedRef = useRef(false);

  // 1. Fetch from Supabase on mount
  useEffect(() => {
    if (!supabase) {
      setDbSyncStatus('local-only');
      isLoadedRef.current = true;
      return;
    }

    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('site_data')
          .select('*');

        if (error) throw error;

        let hasDbData = false;
        let dbContent = null;
        let dbVlogs = null;

        if (data && data.length > 0) {
          const contentRow = data.find(r => r.key === 'content');
          const vlogsRow = data.find(r => r.key === 'vlogs');

          if (contentRow) {
            dbContent = contentRow.value;
            setSiteContent(dbContent);
            hasDbData = true;
          }
          if (vlogsRow) {
            dbVlogs = vlogsRow.value;
            setVlogs(dbVlogs);
            hasDbData = true;
          }
        }

        if (hasDbData) {
          setDbSyncStatus('synced');
          // Update local storage to keep them in sync
          if (dbContent) window.localStorage.setItem('grounded-impact-content', JSON.stringify(dbContent));
          if (dbVlogs) window.localStorage.setItem('grounded-impact-vlogs', JSON.stringify(dbVlogs));
        } else {
          setDbSyncStatus('local-only');
        }
      } catch (err) {
        console.error('Failed to load from Supabase:', err);
        setDbSyncStatus('error');
      } finally {
        setTimeout(() => {
          isLoadedRef.current = true;
        }, 100);
      }
    };

    loadData();
  }, []);

  // 2. Local drafts syncing
  useEffect(() => {
    window.localStorage.setItem('grounded-impact-content', JSON.stringify(siteContent));
    if (isLoadedRef.current) {
      setDbSyncStatus('unsaved');
    }
  }, [siteContent]);

  useEffect(() => {
    window.localStorage.setItem('grounded-impact-vlogs', JSON.stringify(vlogs));
    if (isLoadedRef.current) {
      setDbSyncStatus('unsaved');
    }
  }, [vlogs]);

  // 3. Publish to Supabase RPC
  const publishChanges = async (password) => {
    if (!supabase) {
      setPublishStatus('error');
      setPublishError('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Render environment variables.');
      return false;
    }

    setPublishStatus('publishing');
    setPublishError('');

    try {
      // Publish siteContent
      const { data: contentResult, error: contentError } = await supabase.rpc('update_site_data', {
        p_key: 'content',
        p_value: siteContent,
        p_password: password
      });

      if (contentError) throw contentError;

      // Publish vlogs
      const { data: vlogsResult, error: vlogsError } = await supabase.rpc('update_site_data', {
        p_key: 'vlogs',
        p_value: vlogs,
        p_password: password
      });

      if (vlogsError) throw vlogsError;

      setPublishStatus('success');
      setDbSyncStatus('synced');
      return true;
    } catch (err) {
      console.error('Publish failed:', err);
      const errMsg = err.message || 'An unknown error occurred during publishing.';
      const errDetails = err.details ? ` (${err.details})` : '';
      const errHint = err.hint ? ` [Hint: ${err.hint}]` : '';
      setPublishStatus('error');
      setPublishError(`${errMsg}${errDetails}${errHint}`);
      return false;
    }
  };

  const showPage = (page) => {
    setActivePage(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateSiteContent = (section, updates) => {
    setSiteContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  const getBotResponse = (input) => {
    const lower = input.toLowerCase();
    const brand = `${siteContent.siteMeta.brandName} ${siteContent.siteMeta.brandAccent}`.trim();
    const email = siteContent.contact.contacts.find((item) => item.label.toLowerCase() === 'email')?.value || 'info@grounded-impact.co.ke';
    const location = siteContent.contact.contacts.find((item) => item.label.toLowerCase() === 'location')?.value || 'Nairobi, Kenya';

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return `Hello! I’m Grounded AI for ${brand}. I can guide you through our advisory services, leadership programmes, speaking work, founder story, or the latest vlogs.`;
    }

    if (lower.includes('service') || lower.includes('offer') || lower.includes('advisory')) {
      return `At ${brand}, we help individuals, hospitals, and companies with clinical leadership development, operational excellence, workplace wellness, and keynote speaking. You can explore the Services page for the full picture.`;
    }

    if (lower.includes('founder') || lower.includes('dr') || lower.includes('stanley')) {
      return `Our founder is Dr. Stanley Mwenda Aruyaru, a clinician-led advisor focused on bringing frontline medical insight back into leadership and strategy. Visit the Founder page to learn more.`;
    }

    if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
      return `You can reach ${brand} at ${email} or visit us in ${location}. The Contact page has all the details and an enquiry form.`;
    }

    if (lower.includes('value') || lower.includes('mission') || lower.includes('vision')) {
      return `${brand} is grounded in clinical relevance, measurable outcomes, and leadership that serves patients, hospitals, and organisations with integrity. Our values page explains that approach in more detail.`;
    }

    if (lower.includes('vlog') || lower.includes('blog') || lower.includes('video')) {
      return `Our latest vlogs share practical insights, leadership lessons, and health-sector perspectives from ${brand}. Head to the Vlogs page to view them.`;
    }

    if (lower.includes('story') || lower.includes('why') || lower.includes('problem')) {
      return `We exist to bring the clinician’s voice back into the boardroom. ${brand} helps organisations make stronger decisions by grounding strategy in real frontline clinical experience.`;
    }

    if (lower.includes('cost') || lower.includes('price') || lower.includes('fee') || lower.includes('quote')) {
      return `The cost depends on the scope of the engagement. We usually tailor our services to your needs, so the best next step is to contact us for a personalised quote at ${email}.`;
    }

    return `I can help you learn more about ${brand}’s services, founder, values, contact details, or vlogs. Try asking about “services”, “founder”, “contact”, or “vlogs”.`;
  };

  const sendChatMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatInput('');
    setTimeout(() => {
      const reply = getBotResponse(text);
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home content={siteContent.home} />;
      case 'story': return <Story content={siteContent.story} />;
      case 'services': return <Services content={siteContent.services} />;
      case 'values': return <Values content={siteContent.values} />;
      case 'founder': return <Founder />;
      case 'admin': return (
        <Admin 
          vlogs={vlogs} 
          setVlogs={setVlogs} 
          content={siteContent} 
          updateContent={updateSiteContent} 
          dbSyncStatus={dbSyncStatus}
          publishStatus={publishStatus}
          publishError={publishError}
          publishChanges={publishChanges}
          supabase={supabase}
          setPublishStatus={setPublishStatus}
        />
      );
      case 'vlogs': return <Vlogs vlogs={vlogs} />;
      case 'contact': return <Contact content={siteContent.contact} />;
      default: return <Home content={siteContent.home} />;
    }
  };

  return (
    <div className="App">
      <div className="topbar">
        <div className="container">
          <span>{siteContent.siteMeta.topbarLeft}</span>
          <span>{siteContent.siteMeta.topbarRight}</span>
        </div>
      </div>

      <nav className="navbar">
        <div className="container">
          <a className="logo" href="#" onClick={() => showPage('home')}>
            <img className="logo-icon" src="/Logo.png" alt="Grounded Impact logo" />
            <div>
              <span className="logo-name">{siteContent.siteMeta.brandName} <span>{siteContent.siteMeta.brandAccent}</span></span>
              <div className="logo-tagline">{siteContent.siteMeta.brandTagline}</div>
            </div>
          </a>
          <ul className="nav-links">
            <li><a className={activePage === 'home' ? 'active' : ''} onClick={() => showPage('home')}>Home</a></li>
            <li><a className={activePage === 'story' ? 'active' : ''} onClick={() => showPage('story')}>Story</a></li>
            <li><a className={activePage === 'services' ? 'active' : ''} onClick={() => showPage('services')}>Services</a></li>
            <li><a className={activePage === 'values' ? 'active' : ''} onClick={() => showPage('values')}>Values</a></li>
            <li><a className={activePage === 'vlogs' ? 'active' : ''} onClick={() => showPage('vlogs')}>Vlogs</a></li>
            <li><a className={activePage === 'founder' ? 'active' : ''} onClick={() => showPage('founder')}>Founder</a></li>
            <li><a className={activePage === 'contact' ? 'active ' : ''} onClick={() => showPage('contact')}>Contact</a></li>
            <li><a className={activePage === 'admin' ? 'active' : ''} onClick={() => showPage('admin')}>Admin</a></li>
          </ul>
          <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
          <a className={activePage === 'home' ? 'active' : ''} onClick={() => showPage('home')}>Home</a>
          <a className={activePage === 'story' ? 'active' : ''} onClick={() => showPage('story')}>Story</a>
          <a className={activePage === 'services' ? 'active' : ''} onClick={() => showPage('services')}>Services</a>
          <a className={activePage === 'values' ? 'active' : ''} onClick={() => showPage('values')}>Values</a>
          <a className={activePage === 'vlogs' ? 'active' : ''} onClick={() => showPage('vlogs')}>Vlogs</a>
          <a className={activePage === 'founder' ? 'active' : ''} onClick={() => showPage('founder')}>Founder</a>
          <a className={activePage === 'admin' ? 'active' : ''} onClick={() => showPage('admin')}>Admin</a>
          <a className={activePage === 'contact' ? 'active' : ''} onClick={() => showPage('contact')}>Contact</a>
        </div>
      </nav>

      <div className="page-container">
        {renderPage()}
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">{siteContent.siteMeta.footerBrandName} <span>{siteContent.siteMeta.footerBrandAccent}</span></div>
              <div className="footer-tagline">{siteContent.siteMeta.footerTagline}</div>
              <p className="footer-about">{siteContent.siteMeta.footerAbout}</p>
            </div>
            <div>
              <div className="footer-heading">Navigate</div>
              <ul className="footer-links">
                <li><a onClick={() => showPage('home')}>Home</a></li>
                <li><a onClick={() => showPage('story')}>Story</a></li>
                <li><a onClick={() => showPage('services')}>Services</a></li>
                <li><a onClick={() => showPage('values')}>Values</a></li>
                <li><a onClick={() => showPage('vlogs')}>Vlogs</a></li>
                <li><a onClick={() => showPage('founder')}>Founder</a></li>
                <li><a onClick={() => showPage('admin')}>Admin</a></li>
                <li><a onClick={() => showPage('contact')}>Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="footer-heading">Services</div>
              <ul className="footer-links">
                <li><a onClick={() => showPage('services')}>For Individuals</a></li>
                <li><a onClick={() => showPage('services')}>For Hospitals</a></li>
                <li><a onClick={() => showPage('services')}>For Companies</a></li>
                <li><a onClick={() => showPage('services')}>Speaking</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">{siteContent.siteMeta.footerCopy}</span>
            <span className="footer-copy">The preferred provider of healthcare advisory services in Africa.</span>
          </div>
        </div>
      </footer>

      <button className="chat-toggle" onClick={() => setChatOpen(!chatOpen)}>
        <i className="fas fa-robot" style={{ fontSize: '18px' }}></i> Grounded AI
      </button>
      <div className={`chat-window ${chatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h4><span>Grounded</span> AI</h4>
          <button className="chat-close" onClick={() => setChatOpen(false)}>&times;</button>
        </div>
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div className={`chat-msg ${msg.sender}`} key={idx}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask me about our services..."
            onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
          />
          <button onClick={sendChatMessage}><i className="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>
  );
}

export default App;