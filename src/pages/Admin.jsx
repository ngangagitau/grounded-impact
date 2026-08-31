// pages/Admin.jsx — Full Website Control Panel
import React, { useState } from 'react';

const NAV_ITEMS = [
  { id: 'dashboard',   icon: 'fa-th-large',       label: 'Dashboard'   },
  { id: 'navigation',  icon: 'fa-compass',         label: 'Navigation'  },
  { id: 'theme',       icon: 'fa-paint-brush',    label: 'Theme'       },
  { id: 'site',        icon: 'fa-cog',            label: 'Site Meta'   },
  { id: 'home',        icon: 'fa-home',           label: 'Home'        },
  { id: 'story',       icon: 'fa-book-open',      label: 'Story'       },
  { id: 'services',    icon: 'fa-briefcase',      label: 'Services'    },
  { id: 'values',      icon: 'fa-star',           label: 'Values'      },
  { id: 'founder',     icon: 'fa-user-tie',       label: 'Founder'     },
  { id: 'footer',      icon: 'fa-pen',            label: 'Footer'      },
  { id: 'contact',     icon: 'fa-envelope',       label: 'Contact'     },
  { id: 'vlogs',       icon: 'fa-video',          label: 'Vlogs'       },
];

const Admin = ({
  vlogs,
  setVlogs,
  content,
  updateContent,
  dbSyncStatus,
  publishStatus,
  publishError,
  publishChanges,
  supabase,
  setPublishStatus,
  siteTheme,
  setSiteTheme,
  presetThemes,
  fontOptions,
  defaultTheme,
  saveDraft,
  navConfig,
  setNavConfig,
  defaultNavConfig,
}) => {
  // Ensure `content` is always a usable object to avoid runtime crashes
  const _defaultContent = {
    siteMeta: { brandName: '', brandAccent: '', brandTagline: '', topbarLeft: '', topbarRight: '', footerBrandName: '', footerBrandAccent: '', footerTagline: '', footerAbout: '', footerCopy: '' },
    home: { hero: { title: '', titleAccent: '', subtitle: '', primaryButton: '', secondaryButton: '' }, stats: [], about: { title: '', body: '' }, cards: [], vision: '', mission: '' },
    story: { badge: '', title: '', intro: '', leftText: '', rightText: '', highlightTitle: '', highlightBody: '' },
    services: { badge: '', title: '', intro: '', groups: [] },
    values: { badge: '', title: '', intro: '', vision: '', tagline: '', values: [] },
    founder: { badge: '', name: '', role: '', quote: '', bio1: '', bio2: '', credentials: [], footerNote: '' },
    contact: { badge: '', title: '', intro: '', formTitle: '', formIntro: '', contacts: [] },
    vlogsPage: { badge: '', title: '', intro: '' },
  };

  // Reassign the `content` parameter to a safe default if it's undefined/null
  content = content || _defaultContent;
  /* ── Auth ─────────────────────────────────────── */
  const [isAdmin,         setIsAdmin]         = useState(false);
  const [adminUser,       setAdminUser]       = useState('');
  const [adminPass,       setAdminPass]       = useState('');
  const [isVerifyingLogin,setIsVerifyingLogin]= useState(false);
  const [loginError,      setLoginError]      = useState('');

  /* ── Navigation ───────────────────────────────── */
  const [activeTab,   setActiveTab]   = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ── Vlogs form ───────────────────────────────── */
  const [vlogTitle,    setVlogTitle]    = useState('');
  const [vlogContent,  setVlogContent]  = useState('');
  const [vlogImage,    setVlogImage]    = useState('');
  const [vlogVideoUrl, setVlogVideoUrl] = useState('');
  const [editingVlogId,setEditingVlogId]= useState(null);

  /* ── Publish UI state ─────────────────────────── */
  const [publishConfirm, setPublishConfirm] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  /* ─────────────────────────────────────────────── */
  /*  Auth helpers                                   */
  /* ─────────────────────────────────────────────── */
  const handleAdminLogin = async () => {
    setLoginError('');
    if (!adminUser.trim() || !adminPass.trim()) {
      setLoginError('Please fill in both username and password.');
      return;
    }
    if (adminUser !== 'admin') {
      setLoginError('Invalid credentials.');
      return;
    }
    if (!supabase) {
      if (adminPass === 'grounded2026' || adminPass === 'grounded2025') {
        setIsAdmin(true);
      } else {
        setLoginError('Invalid credentials.');
      }
      return;
    }
    setIsVerifyingLogin(true);
    try {
      const { data: isValid, error } = await supabase.rpc('verify_admin_password', { p_password: adminPass });
      if (error) throw error;
      if (isValid) { setIsAdmin(true); }
      else { setLoginError('Invalid credentials.'); }
    } catch {
      if (adminPass === 'grounded2026' || adminPass === 'grounded2025') {
        setIsAdmin(true);
      } else {
        setLoginError('Invalid credentials.');
      }
    } finally {
      setIsVerifyingLogin(false);
    }
  };

  /* ─────────────────────────────────────────────── */
  /*  Content helpers                                */
  /* ─────────────────────────────────────────────── */
  const updateSection   = (section, key, value) => updateContent(section, { [key]: value });
  const updateArrayItem = (section, arrayKey, index, key, value) => {
    const next = [...(content[section]?.[arrayKey] || [])];
    if (key == null) {
      next[index] = value;
    } else {
      next[index] = { ...next[index], [key]: value };
    }
    updateContent(section, { [arrayKey]: next });
  };
  const vlogsPage = content.vlogsPage || { badge: '', title: '', intro: '' };
  /* ─────────────────────────────────────────────── */
  /*  Vlog helpers                                   */
  /* ─────────────────────────────────────────────── */
  const resetVlogForm = () => {
    setVlogTitle(''); setVlogContent(''); setVlogImage(''); setVlogVideoUrl(''); setEditingVlogId(null);
  };
  const postVlog = () => {
    if (!vlogTitle.trim() || !vlogContent.trim()) { alert('Fill in title and content.'); return; }
    if (editingVlogId) {
      setVlogs(vlogs.map(v => v.id === editingVlogId
        ? { ...v, title: vlogTitle.trim(), content: vlogContent.trim(), image: vlogImage || '', videoUrl: vlogVideoUrl || '' }
        : v));
    } else {
      setVlogs([{ id: Date.now(), title: vlogTitle.trim(), content: vlogContent.trim(), image: vlogImage || '', videoUrl: vlogVideoUrl || '' }, ...vlogs]);
    }
    resetVlogForm();
  };
  const startEditVlog = (vlog) => {
    setEditingVlogId(vlog.id); setVlogTitle(vlog.title); setVlogContent(vlog.content);
    setVlogImage(vlog.image || ''); setVlogVideoUrl(vlog.videoUrl || ''); setActiveTab('vlogs');
  };
  const deleteVlog = (id) => { if (window.confirm('Delete this vlog?')) { setVlogs(vlogs.filter(v => v.id !== id)); if (editingVlogId === id) resetVlogForm(); } };
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setVlogImage(reader.result);
    reader.readAsDataURL(file);
  };

  /* ─────────────────────────────────────────────── */
  /*  Theme helpers                                  */
  /* ─────────────────────────────────────────────── */
  const setThemeProp = (key, value) => setSiteTheme(prev => ({ ...prev, [key]: value }));
  const applyPreset  = (name) => setSiteTheme({ ...presetThemes[name] });
  const resetTheme   = () => setSiteTheme({ ...defaultTheme });

  /* ─────────────────────────────────────────────── */
  /*  Publish helper                                 */
  /* ─────────────────────────────────────────────── */
  const handlePublish = async () => {
    setPublishConfirm(false);
    const success = await publishChanges(adminPass);
    if (success) {
      setPublishStatus('success');
      setTimeout(() => setPublishStatus('idle'), 4000);
    }
  };

  /* ─────────────────────────────────────────────── */
  /*  Sync status badge                              */
  /* ─────────────────────────────────────────────── */
  const SyncBadge = () => {
    const map = {
      loading:    { cls: 'status-loading',  icon: 'fa-spinner fa-spin', text: 'Syncing…'             },
      synced:     { cls: 'status-synced',   icon: 'fa-check-circle',    text: 'Synced with live site' },
      'local-only':{ cls: 'status-local',  icon: 'fa-info-circle',     text: 'Local draft'          },
      unsaved:    { cls: 'status-unsaved',  icon: 'fa-exclamation-triangle', text: 'Unsaved changes' },
      error:      { cls: 'status-error',   icon: 'fa-times-circle',    text: 'Database error'        },
    };
    const s = map[dbSyncStatus] || map['local-only'];
    return <span className={`cp-status-badge ${s.cls}`}><i className={`fas ${s.icon}`}/> {s.text}</span>;
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const ok = await (saveDraft ? saveDraft() : Promise.resolve(false));
      setSaveStatus(ok ? 'saved' : 'error');
    } catch {
      setSaveStatus('error');
    }
    setTimeout(() => setSaveStatus('idle'), 1800);
  };

  /* ═══════════════════════════════════════════════ */
  /*  RENDER — Login screen (not authenticated)      */
  /* ═══════════════════════════════════════════════ */
  if (!isAdmin) {
    return (
      <div className="cp-login-screen">
        <div className="cp-login-bg-orb cp-orb1" />
        <div className="cp-login-bg-orb cp-orb2" />
        <div className="cp-login-card">
          <div className="cp-login-logo">
            <div className="cp-login-icon"><i className="fas fa-shield-alt" /></div>
            <h2>Admin Control Panel</h2>
            <p>Grounded Impact — Website Management</p>
          </div>

          <form className="cp-login-form" onSubmit={e => { e.preventDefault(); handleAdminLogin(); }}>
            <div className="cp-field">
              <label><i className="fas fa-user" /> Username</label>
              <input
                type="text"
                placeholder="admin"
                value={adminUser}
                onChange={e => setAdminUser(e.target.value)}
                disabled={isVerifyingLogin}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            <div className="cp-field">
              <label><i className="fas fa-lock" /> Password</label>
              <input
                type="password"
                placeholder="••••••••••"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                disabled={isVerifyingLogin}
                onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              />
            </div>
            {loginError && (
              <div className="cp-login-error"><i className="fas fa-exclamation-circle" /> {loginError}</div>
            )}
            <button type="submit" className="cp-login-btn" disabled={isVerifyingLogin}>
              {isVerifyingLogin ? <><i className="fas fa-spinner fa-spin" /> Verifying…</> : <><i className="fas fa-sign-in-alt" /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════ */
  /*  RENDER — Control Panel (authenticated)         */
  /* ═══════════════════════════════════════════════ */
  return (
    <div className="cp-layout">

      {/* ── SIDEBAR ──────────────────────────────── */}
      <aside className={`cp-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="cp-sidebar-header">
          <div className="cp-sidebar-brand">
            {sidebarOpen && <><span>Control</span> Panel</>}
          </div>
          <button className="cp-sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
            <i className={`fas ${sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`} />
          </button>
        </div>

        <nav className="cp-sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              className={`cp-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <i className={`fas ${item.icon} cp-nav-icon`} />
              {sidebarOpen && <span className="cp-nav-label">{item.label}</span>}
              {activeTab === item.id && <span className="cp-nav-active-dot" />}
            </button>
          ))}
        </nav>

        <div className="cp-sidebar-footer">
          {sidebarOpen && <SyncBadge />}
          <button className="cp-signout-btn" onClick={() => { setIsAdmin(false); setAdminUser(''); setAdminPass(''); }} title="Sign out">
            <i className="fas fa-sign-out-alt" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <main className="cp-main">

        {/* ── Top Bar ── */}
        <header className="cp-topbar">
          <div className="cp-topbar-left">
            <div className="cp-topbar-title">
              <i className={`fas ${NAV_ITEMS.find(n => n.id === activeTab)?.icon}`} />
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </div>
          </div>
          <div className="cp-topbar-right">
            <SyncBadge />
            <button
              className="cp-save-btn"
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              title="Save draft locally"
            >
              {saveStatus === 'saving' ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className="fas fa-save" /> Save</>}
            </button>
            {saveStatus === 'saved' && <span className="cp-save-notice">Saved</span>}
            {/* Publish */}
            {!publishConfirm ? (
              <button
                className={`cp-publish-btn ${dbSyncStatus === 'unsaved' ? 'pulsing' : ''}`}
                onClick={() => setPublishConfirm(true)}
                disabled={publishStatus === 'publishing' || !supabase}
                title={!supabase ? 'Connect Supabase to publish globally' : ''}
              >
                {publishStatus === 'publishing'
                  ? <><i className="fas fa-spinner fa-spin" /> Publishing…</>
                  : <><i className="fas fa-cloud-upload-alt" /> Publish</>}
              </button>
            ) : (
              <div className="cp-publish-confirm">
                <span>Publish live?</span>
                <button className="cp-confirm-yes" onClick={handlePublish}><i className="fas fa-check" /> Yes</button>
                <button className="cp-confirm-no"  onClick={() => setPublishConfirm(false)}><i className="fas fa-times" /> No</button>
              </div>
            )}
          </div>
        </header>

        {/* ── Banners ── */}
        {publishStatus === 'success' && (
          <div className="cp-banner cp-banner-success">
            <i className="fas fa-check-circle" /> Changes published successfully — the live site has been updated!
          </div>
        )}
        {publishStatus === 'error' && publishError && (
          <div className="cp-banner cp-banner-error">
            <i className="fas fa-exclamation-circle" /> <strong>Publish error:</strong> {publishError}
          </div>
        )}

        {/* ── TAB CONTENT ── */}
        <div className="cp-content">

          {/* ══════════════════════════════════════ */}
          {/*  DASHBOARD                             */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="cp-section">
              <div className="cp-section-header">
                <h2>Dashboard</h2>
                <p>Welcome back. Your site is live and ready to manage.</p>
              </div>

              {/* Stat cards */}
              <div className="cp-dashboard-grid">
                {[
                  { icon: 'fa-layer-group', label: 'Content Sections', value: '8',                    color: '#C9A84C' },
                  { icon: 'fa-video',       label: 'Vlogs Published',  value: vlogs.length,           color: '#3A7F7A' },
                  { icon: 'fa-paint-brush', label: 'Active Theme',     value: 'Custom',               color: '#A855F7' },
                  { icon: 'fa-database',    label: 'Sync Status',      value: dbSyncStatus === 'synced' ? 'Live' : dbSyncStatus === 'unsaved' ? 'Unsaved' : 'Local', color: dbSyncStatus === 'synced' ? '#4ade80' : '#f87171' },
                ].map((card, i) => (
                  <div className="cp-dash-card" key={i} style={{ '--card-accent': card.color }}>
                    <div className="cp-dash-card-icon"><i className={`fas ${card.icon}`} /></div>
                    <div className="cp-dash-card-info">
                      <div className="cp-dash-card-value">{card.value}</div>
                      <div className="cp-dash-card-label">{card.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="cp-quick-actions">
                <h3><i className="fas fa-bolt" /> Quick Actions</h3>
                <div className="cp-quick-grid">
                  {[
                    { icon: 'fa-paint-brush',      label: 'Customise Theme',    tab: 'theme'    },
                    { icon: 'fa-home',             label: 'Edit Home Page',     tab: 'home'     },
                    { icon: 'fa-video',            label: 'Post a Vlog',        tab: 'vlogs'    },
                    { icon: 'fa-user-tie',         label: 'Edit Founder Page',   tab: 'founder'  },
                    { icon: 'fa-envelope',         label: 'Update Contact',     tab: 'contact'  },
                    { icon: 'fa-cog',              label: 'Site Settings',      tab: 'site'     },
                    { icon: 'fa-briefcase',        label: 'Edit Services',      tab: 'services' },
                  ].map((q, i) => (
                    <button key={i} className="cp-quick-btn" onClick={() => setActiveTab(q.tab)}>
                      <i className={`fas ${q.icon}`} /><span>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections overview */}
              <div className="cp-overview-table">
                <h3><i className="fas fa-list" /> Pages Overview</h3>
                <div className="cp-table">
                  {['Home', 'Story', 'Services', 'Values', 'Founder', 'Contact', 'Vlogs'].map(page => (
                    <div key={page} className="cp-table-row" onClick={() => setActiveTab(page.toLowerCase())}>
                      <span className="cp-table-page">{page}</span>
                      <span className="cp-table-status"><i className="fas fa-circle" style={{ color: '#4ade80', fontSize: '8px' }} /> Live</span>
                      <span className="cp-table-action"><i className="fas fa-pencil-alt" /> Edit</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  THEME                                 */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'theme' && (
            <div className="cp-section">
              <div className="cp-section-header">
                <h2>Theme Customiser</h2>
                <p>Change colors, fonts, and style — all changes apply to the live site instantly.</p>
              </div>

              {/* Preset swatches */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-magic" /> Preset Themes</div>
                <div className="cp-presets-grid">
                  {Object.entries(presetThemes).map(([name, theme]) => (
                    <button key={name} className="cp-preset-card" onClick={() => applyPreset(name)}>
                      <div className="cp-preset-swatches">
                        <span style={{ background: theme.navy }}     />
                        <span style={{ background: theme.gold }}     />
                        <span style={{ background: theme.teal }}     />
                        <span style={{ background: theme.navyMid }}  />
                      </div>
                      <div className="cp-preset-name">{name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color pickers */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-palette" /> Color Palette</div>
                <div className="cp-color-grid">
                  {[
                    { key: 'navy',       label: 'Primary (Navy)',     desc: 'Main dark color — navbar, hero, footer' },
                    { key: 'navyDeep',   label: 'Deep Primary',       desc: 'Darkest shade — backgrounds' },
                    { key: 'navyMid',    label: 'Mid Primary',        desc: 'Mid-dark sections' },
                    { key: 'gold',       label: 'Accent (Gold)',      desc: 'Buttons, highlights, active states' },
                    { key: 'goldLight',  label: 'Accent Light',       desc: 'Hover states, lighter accents' },
                    { key: 'goldPale',   label: 'Accent Pale',        desc: 'Light backgrounds, card fills' },
                    { key: 'teal',       label: 'Secondary (Teal)',   desc: 'Supporting accent color' },
                    { key: 'text',       label: 'Body Text',          desc: 'Primary readable text' },
                    { key: 'textMid',    label: 'Mid Text',           desc: 'Secondary paragraphs' },
                    { key: 'textMuted',  label: 'Muted Text',         desc: 'Labels, captions, hints' },
                    { key: 'offWhite',   label: 'Off-white BG',       desc: 'Light page backgrounds' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="cp-color-row">
                      <div className="cp-color-preview" style={{ background: siteTheme[key] }}>
                        <input
                          type="color"
                          value={siteTheme[key]}
                          onChange={e => setThemeProp(key, e.target.value)}
                          className="cp-color-input"
                        />
                      </div>
                      <div className="cp-color-info">
                        <div className="cp-color-label">{label}</div>
                        <div className="cp-color-desc">{desc}</div>
                      </div>
                      <input
                        type="text"
                        value={siteTheme[key]}
                        onChange={e => setThemeProp(key, e.target.value)}
                        className="cp-color-hex"
                        maxLength={7}
                        spellCheck={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Typography */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-font" /> Typography</div>
                <div className="cp-font-grid">
                  <div className="cp-font-row">
                    <div className="cp-font-label">Body Font</div>
                    <div className="cp-font-preview" style={{ fontFamily: siteTheme.fontBody }}>The quick brown fox</div>
                    <select value={siteTheme.fontBody} onChange={e => setThemeProp('fontBody', e.target.value)} className="cp-font-select">
                      {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                  <div className="cp-font-row">
                    <div className="cp-font-label">Display / Heading Font</div>
                    <div className="cp-font-preview" style={{ fontFamily: siteTheme.fontDisplay, fontWeight: 700, fontSize: '18px' }}>Grounded Impact</div>
                    <select value={siteTheme.fontDisplay} onChange={e => setThemeProp('fontDisplay', e.target.value)} className="cp-font-select">
                      {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Border radius */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-vector-square" /> Shape & Roundness</div>
                <div className="cp-slider-rows">
                  <div className="cp-slider-row">
                    <label>Border Radius (Cards) — {siteTheme.radius}px</label>
                    <div className="cp-slider-preview-box" style={{ borderRadius: `${siteTheme.radius}px`, background: siteTheme.gold, width: 80, height: 40 }} />
                    <input type="range" min="0" max="32" value={siteTheme.radius} onChange={e => setThemeProp('radius', e.target.value)} className="cp-slider" />
                  </div>
                  <div className="cp-slider-row">
                    <label>Border Radius (Panels) — {siteTheme.radiusLg}px</label>
                    <div className="cp-slider-preview-box" style={{ borderRadius: `${siteTheme.radiusLg}px`, background: siteTheme.navy, width: 80, height: 40 }} />
                    <input type="range" min="0" max="48" value={siteTheme.radiusLg} onChange={e => setThemeProp('radiusLg', e.target.value)} className="cp-slider" />
                  </div>
                </div>
              </div>

              {/* Mini Live Preview */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-eye" /> Live Preview</div>
                <div className="cp-preview-scene" style={{ '--pv-navy': siteTheme.navy, '--pv-gold': siteTheme.gold, '--pv-teal': siteTheme.teal, '--pv-bg': siteTheme.offWhite, '--pv-text': siteTheme.text, '--pv-radius': siteTheme.radius + 'px', '--pv-font': siteTheme.fontBody }}>
                  <div className="cp-pv-nav" style={{ background: siteTheme.navy }}>
                    <span style={{ color: siteTheme.gold, fontWeight: 700, fontFamily: siteTheme.fontDisplay }}>Grounded <span style={{ color: '#fff' }}>Impact</span></span>
                    <div className="cp-pv-nav-links">
                      {['Home','Services','Contact'].map(l => <span key={l} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{l}</span>)}
                    </div>
                  </div>
                  <div className="cp-pv-hero" style={{ background: `linear-gradient(135deg, ${siteTheme.navyDeep}, ${siteTheme.navy})` }}>
                    <div style={{ fontFamily: siteTheme.fontDisplay, color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                      Superior Services <span style={{ color: siteTheme.gold }}>Grounded in Clinical Relevance</span>
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, marginBottom: 10 }}>
                      Bringing the clinician's voice back to the boardroom.
                    </div>
                    <button style={{ background: `linear-gradient(135deg, ${siteTheme.gold}, ${siteTheme.goldLight})`, color: siteTheme.navy, border: 'none', padding: '5px 14px', borderRadius: 999, fontWeight: 700, fontSize: 10, cursor: 'default' }}>
                      Explore Services
                    </button>
                  </div>
                  <div className="cp-pv-cards" style={{ background: siteTheme.offWhite }}>
                    {['Advisory','Leadership','Speaking'].map(t => (
                      <div key={t} className="cp-pv-card" style={{ borderRadius: siteTheme.radius + 'px', borderTop: `3px solid ${siteTheme.gold}`, background: '#fff', padding: '8px 10px', fontSize: 10, fontWeight: 600, color: siteTheme.navy, fontFamily: siteTheme.fontBody }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reset */}
              <div className="cp-card cp-card-reset">
                <div className="cp-card-title"><i className="fas fa-undo" /> Reset Theme</div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 14 }}>
                  Restore the original Classic Navy theme. This cannot be undone without publishing or refreshing.
                </p>
                <button className="cp-reset-btn" onClick={resetTheme}>
                  <i className="fas fa-undo" /> Reset to Default Theme
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  SITE META                             */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'site' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Site Settings</h2><p>Brand name, topbar text, and footer details.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-id-card" /> Brand Identity</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Brand Name</label><input value={content.siteMeta.brandName} onChange={e => updateSection('siteMeta', 'brandName', e.target.value)} /></div>
                  <div className="cp-field"><label>Brand Accent</label><input value={content.siteMeta.brandAccent} onChange={e => updateSection('siteMeta', 'brandAccent', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Brand Tagline</label><input value={content.siteMeta.brandTagline} onChange={e => updateSection('siteMeta', 'brandTagline', e.target.value)} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-bars" /> Top Bar</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Left Text</label><input value={content.siteMeta.topbarLeft} onChange={e => updateSection('siteMeta', 'topbarLeft', e.target.value)} /></div>
                  <div className="cp-field"><label>Right Text</label><input value={content.siteMeta.topbarRight} onChange={e => updateSection('siteMeta', 'topbarRight', e.target.value)} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-align-left" /> Footer</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Footer Brand Name</label><input value={content.siteMeta.footerBrandName} onChange={e => updateSection('siteMeta', 'footerBrandName', e.target.value)} /></div>
                  <div className="cp-field"><label>Footer Accent</label><input value={content.siteMeta.footerBrandAccent} onChange={e => updateSection('siteMeta', 'footerBrandAccent', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Footer Tagline</label><input value={content.siteMeta.footerTagline} onChange={e => updateSection('siteMeta', 'footerTagline', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Footer About Text</label><textarea value={content.siteMeta.footerAbout} onChange={e => updateSection('siteMeta', 'footerAbout', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Copyright Text</label><input value={content.siteMeta.footerCopy} onChange={e => updateSection('siteMeta', 'footerCopy', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  FOOTER                                */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'footer' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Footer</h2><p>Edit footer brand, tagline, about text and copyright.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-align-left" /> Footer Editor</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Footer Brand Name</label><input value={content.siteMeta.footerBrandName} onChange={e => updateSection('siteMeta', 'footerBrandName', e.target.value)} /></div>
                  <div className="cp-field"><label>Footer Accent</label><input value={content.siteMeta.footerBrandAccent} onChange={e => updateSection('siteMeta', 'footerBrandAccent', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Footer Tagline</label><input value={content.siteMeta.footerTagline} onChange={e => updateSection('siteMeta', 'footerTagline', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Footer About Text</label><textarea value={content.siteMeta.footerAbout} onChange={e => updateSection('siteMeta', 'footerAbout', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Copyright Text</label><input value={content.siteMeta.footerCopy} onChange={e => updateSection('siteMeta', 'footerCopy', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  HOME                                  */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'home' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Home Page</h2><p>Hero section, stats, feature cards, vision & mission.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-images" /> Hero Section</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Hero Title</label><input value={content.home.hero.title} onChange={e => updateContent('home', { hero: { ...content.home.hero, title: e.target.value } })} /></div>
                  <div className="cp-field"><label>Hero Accent</label><input value={content.home.hero.titleAccent} onChange={e => updateContent('home', { hero: { ...content.home.hero, titleAccent: e.target.value } })} /></div>
                  <div className="cp-field cp-field-full"><label>Hero Subtitle</label><textarea value={content.home.hero.subtitle} onChange={e => updateContent('home', { hero: { ...content.home.hero, subtitle: e.target.value } })} /></div>
                  <div className="cp-field"><label>Primary Button</label><input value={content.home.hero.primaryButton} onChange={e => updateContent('home', { hero: { ...content.home.hero, primaryButton: e.target.value } })} /></div>
                  <div className="cp-field"><label>Secondary Button</label><input value={content.home.hero.secondaryButton} onChange={e => updateContent('home', { hero: { ...content.home.hero, secondaryButton: e.target.value } })} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-chart-bar" /> Stats</div>
                <div className="cp-form-grid">
                  {content.home.stats.map((stat, i) => (
                    <React.Fragment key={i}>
                      <div className="cp-field"><label>Stat {i+1} Value</label><input value={stat.value} onChange={e => updateArrayItem('home', 'stats', i, 'value', e.target.value)} /></div>
                      <div className="cp-field"><label>Stat {i+1} Label</label><input value={stat.label} onChange={e => updateArrayItem('home', 'stats', i, 'label', e.target.value)} /></div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-align-left" /> About Section</div>
                <div className="cp-form-grid">
                  <div className="cp-field cp-field-full"><label>About Title</label><input value={content.home.about.title} onChange={e => updateContent('home', { about: { ...content.home.about, title: e.target.value } })} /></div>
                  <div className="cp-field cp-field-full"><label>About Body</label><textarea value={content.home.about.body} onChange={e => updateContent('home', { about: { ...content.home.about, body: e.target.value } })} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-th-large" /> Feature Cards</div>
                {content.home.cards.map((card, i) => (
                  <div key={i} className="cp-sub-card">
                    <div className="cp-sub-card-label">Card {i+1}</div>
                    <div className="cp-form-grid">
                      <div className="cp-field"><label>Title</label><input value={card.title} onChange={e => updateArrayItem('home', 'cards', i, 'title', e.target.value)} /></div>
                      <div className="cp-field"><label>Icon (Font Awesome class)</label><input value={card.icon} onChange={e => updateArrayItem('home', 'cards', i, 'icon', e.target.value)} /></div>
                      <div className="cp-field cp-field-full"><label>Text</label><textarea value={card.text} onChange={e => updateArrayItem('home', 'cards', i, 'text', e.target.value)} rows={2} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-bullseye" /> Vision & Mission</div>
                <div className="cp-form-grid">
                  <div className="cp-field cp-field-full"><label>Vision</label><input value={content.home.vision} onChange={e => updateContent('home', { vision: e.target.value })} /></div>
                  <div className="cp-field cp-field-full"><label>Mission</label><textarea value={content.home.mission} onChange={e => updateContent('home', { mission: e.target.value })} rows={2} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  STORY                                 */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'story' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Story Page</h2><p>The origin, context, and key narrative of Grounded Impact.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-book-open" /> Page Content</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={content.story.badge} onChange={e => updateSection('story', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Title</label><input value={content.story.title} onChange={e => updateSection('story', 'title', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Intro</label><input value={content.story.intro} onChange={e => updateSection('story', 'intro', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Left Column</label><textarea value={content.story.leftText} onChange={e => updateSection('story', 'leftText', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Right Column</label><textarea value={content.story.rightText} onChange={e => updateSection('story', 'rightText', e.target.value)} /></div>
                  <div className="cp-field"><label>Highlight Title</label><input value={content.story.highlightTitle} onChange={e => updateSection('story', 'highlightTitle', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Highlight Body</label><textarea value={content.story.highlightBody} onChange={e => updateSection('story', 'highlightBody', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  SERVICES                              */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'services' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Services Page</h2><p>Three service groups — individuals, hospitals, companies.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-heading" /> Section Header</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={content.services.badge} onChange={e => updateSection('services', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Title</label><input value={content.services.title} onChange={e => updateSection('services', 'title', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Intro</label><input value={content.services.intro} onChange={e => updateSection('services', 'intro', e.target.value)} /></div>
                </div>
              </div>
              {content.services.groups.map((group, gi) => (
                <div key={gi} className="cp-card">
                  <div className="cp-card-title"><i className="fas fa-folder" /> Group {gi+1}: {group.title}</div>
                  <div className="cp-form-grid" style={{ marginBottom: 16 }}>
                    <div className="cp-field"><label>Group Title</label><input value={group.title} onChange={e => { const next = [...content.services.groups]; next[gi] = { ...next[gi], title: e.target.value }; updateContent('services', { groups: next }); }} /></div>
                    <div className="cp-field"><label>Group Heading</label><input value={group.heading} onChange={e => { const next = [...content.services.groups]; next[gi] = { ...next[gi], heading: e.target.value }; updateContent('services', { groups: next }); }} /></div>
                  </div>
                  {group.items.map((item, ii) => (
                    <div key={ii} className="cp-sub-card">
                      <div className="cp-sub-card-label">Service {ii+1}</div>
                      <div className="cp-form-grid">
                        <div className="cp-field"><label>Name</label><input value={item.name} onChange={e => { const next = [...content.services.groups]; next[gi].items[ii] = { ...next[gi].items[ii], name: e.target.value }; updateContent('services', { groups: next }); }} /></div>
                        <div className="cp-field"><label>Description</label><input value={item.desc} onChange={e => { const next = [...content.services.groups]; next[gi].items[ii] = { ...next[gi].items[ii], desc: e.target.value }; updateContent('services', { groups: next }); }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  VALUES                                */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'values' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Values Page</h2><p>The GROUND values — six principles that shape every engagement.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-heading" /> Section Header</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={content.values.badge} onChange={e => updateSection('values', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Title</label><input value={content.values.title} onChange={e => updateSection('values', 'title', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Intro</label><input value={content.values.intro} onChange={e => updateSection('values', 'intro', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Vision</label><input value={content.values.vision} onChange={e => updateSection('values', 'vision', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Tagline</label><input value={content.values.tagline} onChange={e => updateSection('values', 'tagline', e.target.value)} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-star" /> Values (GROUND)</div>
                {content.values.values.map((val, i) => (
                  <div key={i} className="cp-sub-card">
                    <div className="cp-sub-card-label">{val.letter} — {val.word}</div>
                    <div className="cp-form-grid">
                      <div className="cp-field"><label>Letter</label><input value={val.letter} onChange={e => updateArrayItem('values', 'values', i, 'letter', e.target.value)} /></div>
                      <div className="cp-field"><label>Word</label><input value={val.word} onChange={e => updateArrayItem('values', 'values', i, 'word', e.target.value)} /></div>
                      <div className="cp-field cp-field-full"><label>Description</label><textarea value={val.desc} onChange={e => updateArrayItem('values', 'values', i, 'desc', e.target.value)} rows={2} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  FOUNDER                               */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'founder' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Founder Page</h2><p>Update the founder profile, bio, credentials, and quote.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-user-tie" /> Founder Profile</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={content.founder.badge} onChange={e => updateSection('founder', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Name</label><input value={content.founder.name} onChange={e => updateSection('founder', 'name', e.target.value)} /></div>
                  <div className="cp-field"><label>Role</label><input value={content.founder.role} onChange={e => updateSection('founder', 'role', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Quote</label><textarea value={content.founder.quote} onChange={e => updateSection('founder', 'quote', e.target.value)} rows={2} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-id-badge" /> Founder Bio</div>
                <div className="cp-form-grid">
                  <div className="cp-field cp-field-full"><label>Intro Paragraph</label><textarea value={content.founder.bio1} onChange={e => updateSection('founder', 'bio1', e.target.value)} rows={3} /></div>
                  <div className="cp-field cp-field-full"><label>Follow-up Paragraph</label><textarea value={content.founder.bio2} onChange={e => updateSection('founder', 'bio2', e.target.value)} rows={3} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-award" /> Credentials</div>
                {content.founder.credentials.map((cred, i) => (
                  <div key={i} className="cp-sub-card">
                    <div className="cp-sub-card-label">Credential {i + 1}</div>
                    <div className="cp-form-grid">
                      <div className="cp-field cp-field-full"><label>Text</label><input value={cred} onChange={e => updateArrayItem('founder', 'credentials', i, null, e.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-pen-nib" /> Footer Note</div>
                <div className="cp-form-grid">
                  <div className="cp-field cp-field-full"><label>Footer Note</label><textarea value={content.founder.footerNote} onChange={e => updateSection('founder', 'footerNote', e.target.value)} rows={2} /></div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  CONTACT                               */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'contact' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Contact Page</h2><p>Contact info, form title, and enquiry introduction.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-heading" /> Section Header</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={content.contact.badge} onChange={e => updateSection('contact', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Title</label><input value={content.contact.title} onChange={e => updateSection('contact', 'title', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Intro</label><input value={content.contact.intro} onChange={e => updateSection('contact', 'intro', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Form Title</label><input value={content.contact.formTitle} onChange={e => updateSection('contact', 'formTitle', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Form Intro</label><textarea value={content.contact.formIntro} onChange={e => updateSection('contact', 'formIntro', e.target.value)} rows={2} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-address-card" /> Contact Details</div>
                {content.contact.contacts.map((item, i) => (
                  <div key={i} className="cp-sub-card">
                    <div className="cp-form-grid">
                      <div className="cp-field"><label>Label</label><input value={item.label} onChange={e => updateArrayItem('contact', 'contacts', i, 'label', e.target.value)} /></div>
                      <div className="cp-field"><label>Value</label><input value={item.value} onChange={e => updateArrayItem('contact', 'contacts', i, 'value', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════ */}
          {/*  NAVIGATION MANAGER                    */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'navigation' && (() => {
            const safeNav = Array.isArray(navConfig) ? navConfig : [];
            const enabledCount = safeNav.filter(n => n.enabled).length;

            const updateNavItem = (id, changes) => {
              setNavConfig(prev => prev.map(n => n.id === id ? { ...n, ...changes } : n));
            };

            const moveItem = (index, direction) => {
              setNavConfig(prev => {
                const next = [...prev];
                const target = index + direction;
                if (target < 0 || target >= next.length) return prev;
                [next[index], next[target]] = [next[target], next[index]];
                return next;
              });
            };

            const PAGE_ICONS = {
              home: 'fa-home', story: 'fa-book-open', services: 'fa-briefcase',
              values: 'fa-star', vlogs: 'fa-video', founder: 'fa-user-tie',
              contact: 'fa-envelope', admin: 'fa-shield-alt',
            };

            return (
              <div className="cp-section">
                <div className="cp-section-header">
                  <h2>Navigation Manager</h2>
                  <p>Rename, reorder, and show/hide pages in the site navbar, mobile menu, and footer — in real time.</p>
                </div>

                {/* Stats strip */}
                <div className="cp-nav-stats-strip">
                  <div className="cp-nav-stat">
                    <span className="cp-nav-stat-value">{enabledCount}</span>
                    <span className="cp-nav-stat-label">Visible Pages</span>
                  </div>
                  <div className="cp-nav-stat">
                    <span className="cp-nav-stat-value">{safeNav.length - enabledCount}</span>
                    <span className="cp-nav-stat-label">Hidden Pages</span>
                  </div>
                  <div className="cp-nav-stat">
                    <span className="cp-nav-stat-value">{safeNav.length}</span>
                    <span className="cp-nav-stat-label">Total Pages</span>
                  </div>
                </div>

                {/* Live preview strip */}
                <div className="cp-card">
                  <div className="cp-card-title"><i className="fas fa-eye" /> Live Nav Preview</div>
                  <div className="cp-nav-preview-bar">
                    <div className="cp-nav-preview-logo">
                      <i className="fas fa-leaf" style={{ color: siteTheme?.gold || '#C9A84C' }} />
                      <span style={{ color: siteTheme?.gold || '#C9A84C', fontWeight: 700, fontSize: 12 }}>Grounded</span>
                      <span style={{ color: '#fff', fontWeight: 700, fontSize: 12 }}>Impact</span>
                    </div>
                    <div className="cp-nav-preview-links">
                      {safeNav.filter(n => n.enabled).map(n => (
                        <span key={n.id} className="cp-nav-preview-link">{n.label}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nav items list */}
                <div className="cp-card">
                  <div className="cp-card-title"><i className="fas fa-list-ol" /> Page Configuration</div>
                  <div className="cp-nav-manager-list">
                    {safeNav.map((item, index) => (
                      <div
                        key={item.id}
                        className={`cp-nav-manager-row ${!item.enabled ? 'cp-nav-row-disabled' : ''}`}
                      >
                        {/* Drag handle / order buttons */}
                        <div className="cp-nav-order-btns">
                          <button
                            className="cp-nav-order-btn"
                            onClick={() => moveItem(index, -1)}
                            disabled={index === 0}
                            title="Move up"
                          ><i className="fas fa-chevron-up" /></button>
                          <span className="cp-nav-order-num">{index + 1}</span>
                          <button
                            className="cp-nav-order-btn"
                            onClick={() => moveItem(index, 1)}
                            disabled={index === safeNav.length - 1}
                            title="Move down"
                          ><i className="fas fa-chevron-down" /></button>
                        </div>

                        {/* Page identity */}
                        <div className="cp-nav-page-id">
                          <div className="cp-nav-page-icon">
                            <i className={`fas ${PAGE_ICONS[item.id] || 'fa-file'}`} />
                          </div>
                          <span className="cp-nav-page-slug">{item.id}</span>
                        </div>

                        {/* Label editor */}
                        <div className="cp-nav-label-field">
                          <label>Display Label</label>
                          <input
                            type="text"
                            value={item.label}
                            onChange={e => updateNavItem(item.id, { label: e.target.value })}
                            placeholder={item.id}
                            maxLength={30}
                          />
                        </div>

                        {/* Toggle */}
                        <div className="cp-nav-toggle-wrap">
                          <span className="cp-nav-toggle-label">
                            {item.enabled ? 'Visible' : 'Hidden'}
                          </span>
                          <button
                            className={`cp-nav-toggle ${item.enabled ? 'on' : 'off'}`}
                            onClick={() => updateNavItem(item.id, { enabled: !item.enabled })}
                            title={item.enabled ? 'Click to hide from nav' : 'Click to show in nav'}
                          >
                            <span className="cp-nav-toggle-thumb" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reset */}
                <div className="cp-card cp-card-reset">
                  <div className="cp-card-title"><i className="fas fa-undo" /> Reset Navigation</div>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 14 }}>
                    Restore the original navigation order, labels, and visibility. This cannot be undone without saving.
                  </p>
                  <button
                    className="cp-reset-btn"
                    onClick={() => setNavConfig(defaultNavConfig ? [...defaultNavConfig] : [])}
                  >
                    <i className="fas fa-undo" /> Reset to Default Navigation
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ══════════════════════════════════════ */}
          {/*  VLOGS                                 */}
          {/* ══════════════════════════════════════ */}
          {activeTab === 'vlogs' && (
            <div className="cp-section">
              <div className="cp-section-header"><h2>Vlogs</h2><p>Create, edit, and manage blog posts and video content.</p></div>
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-heading" /> Page Header</div>
                <div className="cp-form-grid">
                  <div className="cp-field"><label>Badge</label><input value={vlogsPage.badge} onChange={e => updateSection('vlogsPage', 'badge', e.target.value)} /></div>
                  <div className="cp-field"><label>Title</label><input value={vlogsPage.title} onChange={e => updateSection('vlogsPage', 'title', e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Intro</label><textarea value={vlogsPage.intro} onChange={e => updateSection('vlogsPage', 'intro', e.target.value)} rows={2} /></div>
                </div>
              </div>
              <div className="cp-card">
                <div className="cp-card-title">
                  <i className={`fas ${editingVlogId ? 'fa-edit' : 'fa-plus-circle'}`} />
                  {editingVlogId ? 'Edit Vlog' : 'New Vlog'}
                </div>
                <div className="cp-form-grid">
                  <div className="cp-field cp-field-full"><label>Title</label><input placeholder="Vlog title…" value={vlogTitle} onChange={e => setVlogTitle(e.target.value)} /></div>
                  <div className="cp-field cp-field-full"><label>Content</label><textarea placeholder="Write your vlog content here…" value={vlogContent} onChange={e => setVlogContent(e.target.value)} style={{ minHeight: 140 }} /></div>
                  <div className="cp-field">
                    <label>Attach Image</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ color: 'rgba(255,255,255,0.7)' }} />
                  </div>
                  <div className="cp-field">
                    <label>YouTube URL</label>
                    <input placeholder="https://www.youtube.com/watch?v=…" value={vlogVideoUrl} onChange={e => setVlogVideoUrl(e.target.value)} />
                  </div>
                  {vlogImage && (
                    <div className="cp-field cp-field-full">
                      <label>Image Preview</label>
                      <img src={vlogImage} alt="Preview" className="cp-img-preview" />
                    </div>
                  )}
                  <div className="cp-field cp-field-full" style={{ display: 'flex', gap: 12 }}>
                    <button className="cp-action-btn cp-btn-primary" onClick={postVlog}>
                      <i className={`fas ${editingVlogId ? 'fa-save' : 'fa-upload'}`} />
                      {editingVlogId ? 'Update Vlog' : 'Publish Vlog'}
                    </button>
                    {editingVlogId && (
                      <button className="cp-action-btn cp-btn-outline" onClick={resetVlogForm}>
                        <i className="fas fa-times" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Vlog list */}
              <div className="cp-card">
                <div className="cp-card-title"><i className="fas fa-list" /> Published Vlogs ({vlogs.length})</div>
                {vlogs.length === 0 ? (
                  <div className="cp-empty-state"><i className="fas fa-video" /><p>No vlogs yet. Create your first one above.</p></div>
                ) : (
                  <div className="cp-vlog-list">
                    {vlogs.map(vlog => (
                      <div key={vlog.id} className="cp-vlog-item">
                        <div className="cp-vlog-item-header">
                          <h4>{vlog.title}</h4>
                          <div className="cp-vlog-actions">
                            <button className="cp-action-btn cp-btn-sm cp-btn-outline" onClick={() => startEditVlog(vlog)}><i className="fas fa-edit" /> Edit</button>
                            <button className="cp-action-btn cp-btn-sm cp-btn-danger" onClick={() => deleteVlog(vlog.id)}><i className="fas fa-trash" /> Delete</button>
                          </div>
                        </div>
                        <p>{vlog.content}</p>
                        {vlog.image && <img src={vlog.image} alt={vlog.title} className="cp-img-preview" style={{ marginTop: 10 }} />}
                        {vlog.videoUrl && (
                          <div className="cp-video-frame">
                            <iframe src={vlog.videoUrl.replace('watch?v=','embed/').replace('youtu.be/','www.youtube.com/embed/')} title={vlog.title} allowFullScreen />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>{/* /cp-content */}
      </main>
    </div>
  );
};

export default Admin;
