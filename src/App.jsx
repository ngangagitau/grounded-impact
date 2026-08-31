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

// --- Default Theme ---
export const defaultTheme = {
  navy:        '#0B2A4A',
  navyDeep:    '#061926',
  navyMid:     '#163a5c',
  gold:        '#C9A84C',
  goldLight:   '#E0C56F',
  goldPale:    '#f9f2e4',
  teal:        '#3A7F7A',
  white:       '#FFFFFF',
  offWhite:    '#f4f7fb',
  text:        '#182333',
  textMid:     '#425466',
  textMuted:   '#6c7a8b',
  fontBody:    'Inter',
  fontDisplay: 'Playfair Display',
  radius:      '12',
  radiusLg:    '20',
};

const PRESET_THEMES = {
  'Classic Navy': defaultTheme,
  'Crimson Executive': {
    ...defaultTheme,
    navy:      '#3B0A0A',
    navyDeep:  '#1f0505',
    navyMid:   '#5a1010',
    gold:      '#E07B39',
    goldLight: '#F0A070',
    goldPale:  '#fdf0e8',
    teal:      '#8B2252',
  },
  'Deep Forest': {
    ...defaultTheme,
    navy:      '#0A2E1A',
    navyDeep:  '#061409',
    navyMid:   '#154229',
    gold:      '#8DB84A',
    goldLight: '#B0D46E',
    goldPale:  '#f0f7e6',
    teal:      '#2E8B57',
  },
  'Midnight Purple': {
    ...defaultTheme,
    navy:      '#1A0A3B',
    navyDeep:  '#0d051f',
    navyMid:   '#2d1260',
    gold:      '#A855F7',
    goldLight: '#C084FC',
    goldPale:  '#f5eeff',
    teal:      '#7C3AED',
  },
  'Ocean Teal': {
    ...defaultTheme,
    navy:      '#083344',
    navyDeep:  '#041d28',
    navyMid:   '#0e4b62',
    gold:      '#06B6D4',
    goldLight: '#22D3EE',
    goldPale:  '#e0f7fa',
    teal:      '#0D9488',
  },
};

const FONT_OPTIONS = [
  'Inter', 'Roboto', 'Lato', 'Outfit', 'Raleway', 'Nunito', 'Poppins', 'Montserrat', 'Playfair Display'
];

// ── Default navigation configuration ──────────────────────────────────────
export const DEFAULT_NAV_CONFIG = [
  { id: 'home',     label: 'Home',     enabled: true  },
  { id: 'story',    label: 'Story',    enabled: true  },
  { id: 'services', label: 'Services', enabled: true  },
  { id: 'values',   label: 'Values',   enabled: true  },
  { id: 'vlogs',    label: 'Vlogs',    enabled: true  },
  { id: 'founder',  label: 'Founder',  enabled: true  },
  { id: 'contact',  label: 'Contact',  enabled: true  },
  { id: 'admin',    label: 'Admin',    enabled: true  },
];

const getStoredNavConfig = () => {
  if (typeof window === 'undefined') return DEFAULT_NAV_CONFIG;
  try {
    const saved = window.localStorage.getItem('grounded-impact-navconfig');
    if (!saved) return DEFAULT_NAV_CONFIG;
    const parsed = JSON.parse(saved);
    // Merge: keep stored labels/enabled, but preserve order and add any new items
    const storedMap = Object.fromEntries(parsed.map(n => [n.id, n]));
    return DEFAULT_NAV_CONFIG.map(def => storedMap[def.id] ? { ...def, ...storedMap[def.id] } : def);
  } catch {
    return DEFAULT_NAV_CONFIG;
  }
};

const getStoredTheme = () => {
  if (typeof window === 'undefined') return defaultTheme;
  try {
    const saved = window.localStorage.getItem('grounded-impact-theme');
    return saved ? { ...defaultTheme, ...JSON.parse(saved) } : defaultTheme;
  } catch {
    return defaultTheme;
  }
};

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
    footerCopy: `© ${new Date().getFullYear()} Grounded Impact. All rights reserved.`
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
  },
  founder: {
    badge: 'Our Founder',
    name: 'Dr. Stanley Mwenda Aruyaru',
    role: 'Founder, Grounded Impact',
    credentials: ['MBChB', 'MMed Surgery', 'FCS', 'FACS', 'FeHSM', 'PhD Candidate'],
    bio1: 'Dr. Aruyaru started school at age 9 in rural Meru County. He became the first doctor St Cyprian High School ever produced. That origin story is the engine of Grounded Impact — proof that the resources to solve Africa\'s health challenges are already here.',
    bio2: 'Today, he serves as Chief Medical Officer at PCEA Kikuyu Hospital, overseeing four clinical units and more than 500 staff. As Secretary General of the Surgical Society of Kenya, he drives research capacity-building across East and Central Africa.',
    quote: '"If you are good with the tip of the scalpel, you can be good with the tip of the pen."',
    footerNote: 'CMO — PCEA Kikuyu Hospital\nSecretary General — Surgical Society of Kenya'
  },
  vlogsPage: {
    badge: 'Stories & Updates',
    title: 'Vlogs',
    intro: 'Thoughts, lessons, and updates from the Grounded Impact team.'
  }
};

const getStoredSiteContent = () => {
  if (typeof window === 'undefined') return initialSiteContent;
  try {
    const saved = window.localStorage.getItem('grounded-impact-content');
    return saved ? { ...initialSiteContent, ...JSON.parse(saved) } : initialSiteContent;
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
  const [siteTheme, setSiteTheme] = useState(getStoredTheme);
  const [navConfig, setNavConfig] = useState(getStoredNavConfig);
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
          const contentRow  = data.find(r => r.key === 'content');
          const vlogsRow    = data.find(r => r.key === 'vlogs');
          const themeRow    = data.find(r => r.key === 'theme');
          const navRow      = data.find(r => r.key === 'navConfig');

          if (contentRow) {
            dbContent = contentRow.value;
            setSiteContent({ ...initialSiteContent, ...dbContent });
            hasDbData = true;
          }
          if (vlogsRow) {
            dbVlogs = vlogsRow.value;
            setVlogs(dbVlogs);
            hasDbData = true;
          }
          if (themeRow) {
            const dbTheme = { ...defaultTheme, ...themeRow.value };
            setSiteTheme(dbTheme);
            window.localStorage.setItem('grounded-impact-theme', JSON.stringify(dbTheme));
            hasDbData = true;
          }
          if (navRow && Array.isArray(navRow.value)) {
            const storedMap = Object.fromEntries(navRow.value.map(n => [n.id, n]));
            const merged = DEFAULT_NAV_CONFIG.map(def => storedMap[def.id] ? { ...def, ...storedMap[def.id] } : def);
            setNavConfig(merged);
            window.localStorage.setItem('grounded-impact-navconfig', JSON.stringify(merged));
            hasDbData = true;
          }
        }

        if (hasDbData) {
          setDbSyncStatus('synced');
          // Update local storage to keep them in sync
          if (dbContent) window.localStorage.setItem('grounded-impact-content', JSON.stringify(dbContent));
          if (dbVlogs)   window.localStorage.setItem('grounded-impact-vlogs',   JSON.stringify(dbVlogs));
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
    if (isLoadedRef.current) setDbSyncStatus('unsaved');
  }, [siteContent]);

  useEffect(() => {
    window.localStorage.setItem('grounded-impact-vlogs', JSON.stringify(vlogs));
    if (isLoadedRef.current) setDbSyncStatus('unsaved');
  }, [vlogs]);

  useEffect(() => {
    window.localStorage.setItem('grounded-impact-navconfig', JSON.stringify(navConfig));
    if (isLoadedRef.current) setDbSyncStatus('unsaved');
  }, [navConfig]);

  // 2b. Theme syncing — persist locally and apply CSS variables
  useEffect(() => {
    window.localStorage.setItem('grounded-impact-theme', JSON.stringify(siteTheme));
    if (isLoadedRef.current) setDbSyncStatus('unsaved');
    // Inject CSS variables into :root
    const style = document.getElementById('dynamic-theme') || document.createElement('style');
    style.id = 'dynamic-theme';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(siteTheme.fontBody)}:wght@300;400;500;600;700;800&family=${encodeURIComponent(siteTheme.fontDisplay)}:wght@600;700;800&display=swap');
      :root {
        --navy:       ${siteTheme.navy};
        --navy-deep:  ${siteTheme.navyDeep};
        --navy-mid:   ${siteTheme.navyMid};
        --gold:       ${siteTheme.gold};
        --gold-light: ${siteTheme.goldLight};
        --gold-pale:  ${siteTheme.goldPale};
        --teal:       ${siteTheme.teal};
        --white:      ${siteTheme.white};
        --off-white:  ${siteTheme.offWhite};
        --text:       ${siteTheme.text};
        --text-mid:   ${siteTheme.textMid};
        --text-muted: ${siteTheme.textMuted};
        --radius:     ${siteTheme.radius}px;
        --radius-lg:  ${siteTheme.radiusLg}px;
        --font-body:    '${siteTheme.fontBody}', system-ui, -apple-system, sans-serif;
        --font-display: '${siteTheme.fontDisplay}', Georgia, serif;
      }
    `;
    if (!document.getElementById('dynamic-theme')) document.head.appendChild(style);
  }, [siteTheme]);

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
      const { error: contentError } = await supabase.rpc('update_site_data', {
        p_key: 'content',
        p_value: siteContent,
        p_password: password
      });
      if (contentError) throw contentError;

      // Publish vlogs
      const { error: vlogsError } = await supabase.rpc('update_site_data', {
        p_key: 'vlogs',
        p_value: vlogs,
        p_password: password
      });
      if (vlogsError) throw vlogsError;

      // Publish theme
      const { error: themeError } = await supabase.rpc('update_site_data', {
        p_key: 'theme',
        p_value: siteTheme,
        p_password: password
      });
      if (themeError) throw themeError;

      // Publish navConfig
      const { error: navError } = await supabase.rpc('update_site_data', {
        p_key: 'navConfig',
        p_value: navConfig,
        p_password: password
      });
      if (navError) throw navError;

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

  // Save draft locally (persist current state to localStorage)
  const saveDraft = async () => {
    try {
      window.localStorage.setItem('grounded-impact-content', JSON.stringify(siteContent));
      window.localStorage.setItem('grounded-impact-vlogs', JSON.stringify(vlogs));
      window.localStorage.setItem('grounded-impact-navconfig', JSON.stringify(navConfig));
      setDbSyncStatus('local-only');
      return true;
    } catch (err) {
      console.error('Failed to save draft locally:', err);
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
      case 'founder': return <Founder content={siteContent.founder} />;
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
          siteTheme={siteTheme}
          setSiteTheme={setSiteTheme}
          presetThemes={PRESET_THEMES}
          fontOptions={FONT_OPTIONS}
          defaultTheme={defaultTheme}
          saveDraft={saveDraft}
          navConfig={navConfig}
          setNavConfig={setNavConfig}
          defaultNavConfig={DEFAULT_NAV_CONFIG}
        />
      );
      case 'vlogs': return <Vlogs vlogs={vlogs} content={siteContent.vlogsPage} />;
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
            {navConfig.filter(n => n.enabled).map(navItem => (
              <li key={navItem.id}>
                <a
                  className={activePage === navItem.id ? 'active' : ''}
                  onClick={() => showPage(navItem.id)}
                >{navItem.label}</a>
              </li>
            ))}
          </ul>
          <button className={`hamburger ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
          {navConfig.filter(n => n.enabled).map(navItem => (
            <a
              key={navItem.id}
              className={activePage === navItem.id ? 'active' : ''}
              onClick={() => showPage(navItem.id)}
            >{navItem.label}</a>
          ))}
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
                {navConfig.filter(n => n.enabled).map(navItem => (
                  <li key={navItem.id}>
                    <a onClick={() => showPage(navItem.id)}>{navItem.label}</a>
                  </li>
                ))}
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