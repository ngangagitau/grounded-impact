// pages/Admin.js
import React, { useState } from 'react';

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
  setPublishStatus
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isVerifyingLogin, setIsVerifyingLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('site');
  const [vlogTitle, setVlogTitle] = useState('');
  const [vlogContent, setVlogContent] = useState('');
  const [vlogImage, setVlogImage] = useState('');
  const [vlogVideoUrl, setVlogVideoUrl] = useState('');
  const [editingVlogId, setEditingVlogId] = useState(null);

  const handleAdminLogin = async () => {
    if (!adminUser.trim() || !adminPass.trim()) {
      alert('Please fill in both username and password.');
      return;
    }

    if (adminUser !== 'admin') {
      alert('Invalid credentials.');
      return;
    }

    if (!supabase) {
      // Offline / Local-only fallback
      if (adminPass === 'grounded2026' || adminPass === 'grounded2025') {
        setIsAdmin(true);
        alert('Login successful (Offline/Local Mode). You can now update the website.');
      } else {
        alert('Invalid credentials.');
      }
      return;
    }

    setIsVerifyingLogin(true);
    try {
      const { data: isValid, error } = await supabase.rpc('verify_admin_password', {
        p_password: adminPass
      });

      if (error) throw error;

      if (isValid) {
        setIsAdmin(true);
        alert('Login successful. You can now update the website.');
      } else {
        alert('Invalid credentials.');
      }
    } catch (err) {
      console.error('Login verification failed:', err);
      // Fallback in case the DB function is not created yet
      if (adminPass === 'grounded2026' || adminPass === 'grounded2025') {
        setIsAdmin(true);
        alert('Login successful (Local Fallback). You can now update the website.');
      } else {
        alert('Invalid credentials.');
      }
    } finally {
      setIsVerifyingLogin(false);
    }
  };

  const resetVlogForm = () => {
    setVlogTitle('');
    setVlogContent('');
    setVlogImage('');
    setVlogVideoUrl('');
    setEditingVlogId(null);
  };

  const postVlog = () => {
    if (!vlogTitle.trim() || !vlogContent.trim()) {
      alert('Please fill in both title and content.');
      return;
    }
    if (editingVlogId) {
      setVlogs(vlogs.map(vlog => vlog.id === editingVlogId ? { ...vlog, title: vlogTitle.trim(), content: vlogContent.trim(), image: vlogImage || '', videoUrl: vlogVideoUrl || '' } : vlog));
      alert('Vlog updated!');
    } else {
      const newVlog = {
        id: Date.now(),
        title: vlogTitle.trim(),
        content: vlogContent.trim(),
        image: vlogImage || '',
        videoUrl: vlogVideoUrl || ''
      };
      setVlogs([newVlog, ...vlogs]);
      alert('Vlog published!');
    }
    resetVlogForm();
  };

  const startEditVlog = (vlog) => {
    setEditingVlogId(vlog.id);
    setVlogTitle(vlog.title);
    setVlogContent(vlog.content);
    setVlogImage(vlog.image || '');
    setVlogVideoUrl(vlog.videoUrl || '');
    setActiveTab('vlogs');
  };

  const deleteVlog = (vlogId) => {
    if (window.confirm('Delete this vlog?')) {
      setVlogs(vlogs.filter(vlog => vlog.id !== vlogId));
      if (editingVlogId === vlogId) {
        resetVlogForm();
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setVlogImage(reader.result);
    reader.readAsDataURL(file);
  };

  const updateSection = (section, key, value) => {
    updateContent(section, { [key]: value });
  };

  const updateArrayItem = (section, arrayKey, index, key, value) => {
    const next = [...(content[section][arrayKey] || [])];
    next[index] = { ...next[index], [key]: value };
    updateContent(section, { [arrayKey]: next });
  };

  const updateNestedArrayItem = (section, arrayKey, index, subKey, key, value) => {
    const next = [...(content[section][arrayKey] || [])];
    next[index] = {
      ...next[index],
      [subKey]: next[index][subKey].map((item, i) => i === index ? { ...item, [key]: value } : item)
    };
    updateContent(section, { [arrayKey]: next });
  };

  const renderSiteMeta = () => (
    <div className="admin-section">
      <h5>Site Metadata</h5>
      <div className="form-grid">
        <div><label>Top bar left</label><input value={content.siteMeta.topbarLeft} onChange={(e) => updateSection('siteMeta', 'topbarLeft', e.target.value)} /></div>
        <div><label>Top bar right</label><input value={content.siteMeta.topbarRight} onChange={(e) => updateSection('siteMeta', 'topbarRight', e.target.value)} /></div>
        <div><label>Brand name</label><input value={content.siteMeta.brandName} onChange={(e) => updateSection('siteMeta', 'brandName', e.target.value)} /></div>
        <div><label>Brand accent</label><input value={content.siteMeta.brandAccent} onChange={(e) => updateSection('siteMeta', 'brandAccent', e.target.value)} /></div>
        <div><label>Brand tagline</label><input value={content.siteMeta.brandTagline} onChange={(e) => updateSection('siteMeta', 'brandTagline', e.target.value)} /></div>
        <div><label>Footer tagline</label><input value={content.siteMeta.footerTagline} onChange={(e) => updateSection('siteMeta', 'footerTagline', e.target.value)} /></div>
        <div className="form-grid-full"><label>Footer about</label><textarea value={content.siteMeta.footerAbout} onChange={(e) => updateSection('siteMeta', 'footerAbout', e.target.value)} /></div>
        <div className="form-grid-full"><label>Footer copy</label><input value={content.siteMeta.footerCopy} onChange={(e) => updateSection('siteMeta', 'footerCopy', e.target.value)} /></div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="admin-section">
      <h5>Home Page</h5>
      <div className="form-grid">
        <div><label>Hero title</label><input value={content.home.hero.title} onChange={(e) => updateContent('home', { hero: { ...content.home.hero, title: e.target.value } })} /></div>
        <div><label>Hero accent</label><input value={content.home.hero.titleAccent} onChange={(e) => updateContent('home', { hero: { ...content.home.hero, titleAccent: e.target.value } })} /></div>
        <div className="form-grid-full"><label>Hero subtitle</label><textarea value={content.home.hero.subtitle} onChange={(e) => updateContent('home', { hero: { ...content.home.hero, subtitle: e.target.value } })} /></div>
        <div><label>Primary button</label><input value={content.home.hero.primaryButton} onChange={(e) => updateContent('home', { hero: { ...content.home.hero, primaryButton: e.target.value } })} /></div>
        <div><label>Secondary button</label><input value={content.home.hero.secondaryButton} onChange={(e) => updateContent('home', { hero: { ...content.home.hero, secondaryButton: e.target.value } })} /></div>
        <div className="form-grid-full"><label>About title</label><input value={content.home.about.title} onChange={(e) => updateContent('home', { about: { ...content.home.about, title: e.target.value } })} /></div>
        <div className="form-grid-full"><label>About body</label><textarea value={content.home.about.body} onChange={(e) => updateContent('home', { about: { ...content.home.about, body: e.target.value } })} /></div>
        <div className="form-grid-full"><label>Vision</label><input value={content.home.vision} onChange={(e) => updateContent('home', { vision: e.target.value })} /></div>
        <div className="form-grid-full"><label>Mission</label><input value={content.home.mission} onChange={(e) => updateContent('home', { mission: e.target.value })} /></div>
      </div>
      <div className="admin-list-item">
        {content.home.stats.map((stat, index) => (
          <div className="form-grid" key={index} style={{ marginTop: '8px' }}>
            <div><label>Stat value {index + 1}</label><input value={stat.value} onChange={(e) => updateArrayItem('home', 'stats', index, 'value', e.target.value)} /></div>
            <div><label>Stat label {index + 1}</label><input value={stat.label} onChange={(e) => updateArrayItem('home', 'stats', index, 'label', e.target.value)} /></div>
          </div>
        ))}
      </div>
      {content.home.cards.map((card, index) => (
        <div className="admin-list-item" key={index}>
          <div className="form-grid">
            <div><label>Card title {index + 1}</label><input value={card.title} onChange={(e) => updateArrayItem('home', 'cards', index, 'title', e.target.value)} /></div>
            <div><label>Card icon {index + 1}</label><input value={card.icon} onChange={(e) => updateArrayItem('home', 'cards', index, 'icon', e.target.value)} /></div>
            <div className="form-grid-full"><label>Card text {index + 1}</label><textarea value={card.text} onChange={(e) => updateArrayItem('home', 'cards', index, 'text', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStory = () => (
    <div className="admin-section">
      <h5>Story Page</h5>
      <div className="form-grid">
        <div><label>Badge</label><input value={content.story.badge} onChange={(e) => updateSection('story', 'badge', e.target.value)} /></div>
        <div><label>Title</label><input value={content.story.title} onChange={(e) => updateSection('story', 'title', e.target.value)} /></div>
        <div className="form-grid-full"><label>Intro</label><input value={content.story.intro} onChange={(e) => updateSection('story', 'intro', e.target.value)} /></div>
        <div className="form-grid-full"><label>Left column text</label><textarea value={content.story.leftText} onChange={(e) => updateSection('story', 'leftText', e.target.value)} /></div>
        <div className="form-grid-full"><label>Right column text</label><textarea value={content.story.rightText} onChange={(e) => updateSection('story', 'rightText', e.target.value)} /></div>
        <div><label>Highlight title</label><input value={content.story.highlightTitle} onChange={(e) => updateSection('story', 'highlightTitle', e.target.value)} /></div>
        <div className="form-grid-full"><label>Highlight body</label><textarea value={content.story.highlightBody} onChange={(e) => updateSection('story', 'highlightBody', e.target.value)} /></div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="admin-section">
      <h5>Services Page</h5>
      <div className="form-grid">
        <div><label>Section badge</label><input value={content.services.badge} onChange={(e) => updateSection('services', 'badge', e.target.value)} /></div>
        <div><label>Section title</label><input value={content.services.title} onChange={(e) => updateSection('services', 'title', e.target.value)} /></div>
        <div className="form-grid-full"><label>Section intro</label><input value={content.services.intro} onChange={(e) => updateSection('services', 'intro', e.target.value)} /></div>
      </div>
      {content.services.groups.map((group, groupIndex) => (
        <div className="admin-list-item" key={groupIndex}>
          <div className="form-grid">
            <div><label>Group title {groupIndex + 1}</label><input value={group.title} onChange={(e) => {
              const next = [...content.services.groups];
              next[groupIndex] = { ...next[groupIndex], title: e.target.value };
              updateContent('services', { groups: next });
            }} /></div>
            <div><label>Group heading {groupIndex + 1}</label><input value={group.heading} onChange={(e) => {
              const next = [...content.services.groups];
              next[groupIndex] = { ...next[groupIndex], heading: e.target.value };
              updateContent('services', { groups: next });
            }} /></div>
          </div>
          {group.items.map((item, itemIndex) => (
            <div className="form-grid" key={itemIndex} style={{ marginTop: '8px' }}>
              <div><label>Service {itemIndex + 1} name</label><input value={item.name} onChange={(e) => {
                const next = [...content.services.groups];
                next[groupIndex].items[itemIndex] = { ...next[groupIndex].items[itemIndex], name: e.target.value };
                updateContent('services', { groups: next });
              }} /></div>
              <div><label>Service {itemIndex + 1} desc</label><input value={item.desc} onChange={(e) => {
                const next = [...content.services.groups];
                next[groupIndex].items[itemIndex] = { ...next[groupIndex].items[itemIndex], desc: e.target.value };
                updateContent('services', { groups: next });
              }} /></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderValues = () => (
    <div className="admin-section">
      <h5>Values Page</h5>
      <div className="form-grid">
        <div><label>Badge</label><input value={content.values.badge} onChange={(e) => updateSection('values', 'badge', e.target.value)} /></div>
        <div><label>Title</label><input value={content.values.title} onChange={(e) => updateSection('values', 'title', e.target.value)} /></div>
        <div className="form-grid-full"><label>Intro</label><input value={content.values.intro} onChange={(e) => updateSection('values', 'intro', e.target.value)} /></div>
        <div className="form-grid-full"><label>Vision</label><input value={content.values.vision} onChange={(e) => updateSection('values', 'vision', e.target.value)} /></div>
        <div className="form-grid-full"><label>Tagline</label><input value={content.values.tagline} onChange={(e) => updateSection('values', 'tagline', e.target.value)} /></div>
      </div>
      {content.values.values.map((value, index) => (
        <div className="admin-list-item" key={index}>
          <div className="form-grid">
            <div><label>Letter</label><input value={value.letter} onChange={(e) => updateArrayItem('values', 'values', index, 'letter', e.target.value)} /></div>
            <div><label>Word</label><input value={value.word} onChange={(e) => updateArrayItem('values', 'values', index, 'word', e.target.value)} /></div>
            <div className="form-grid-full"><label>Description</label><textarea value={value.desc} onChange={(e) => updateArrayItem('values', 'values', index, 'desc', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContact = () => (
    <div className="admin-section">
      <h5>Contact Page</h5>
      <div className="form-grid">
        <div><label>Badge</label><input value={content.contact.badge} onChange={(e) => updateSection('contact', 'badge', e.target.value)} /></div>
        <div><label>Title</label><input value={content.contact.title} onChange={(e) => updateSection('contact', 'title', e.target.value)} /></div>
        <div className="form-grid-full"><label>Intro</label><input value={content.contact.intro} onChange={(e) => updateSection('contact', 'intro', e.target.value)} /></div>
        <div className="form-grid-full"><label>Form title</label><input value={content.contact.formTitle} onChange={(e) => updateSection('contact', 'formTitle', e.target.value)} /></div>
        <div className="form-grid-full"><label>Form intro</label><input value={content.contact.formIntro} onChange={(e) => updateSection('contact', 'formIntro', e.target.value)} /></div>
      </div>
      {content.contact.contacts.map((item, index) => (
        <div className="admin-list-item" key={index}>
          <div className="form-grid">
            <div><label>Label</label><input value={item.label} onChange={(e) => updateArrayItem('contact', 'contacts', index, 'label', e.target.value)} /></div>
            <div><label>Value</label><input value={item.value} onChange={(e) => updateArrayItem('contact', 'contacts', index, 'value', e.target.value)} /></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>Admin Portal</div>
          <h2>Manage the Full Website</h2>
          <p>Log in to edit the branding, pages, contact details, and blog posts.</p>
        </div>
      </div>
      <section className="section section-dark">
        <div className="container">
          <div className="admin-portal">
            <div className="admin-hero">
              <div className="admin-hero-copy">
                <div className="admin-badge"><i className="fas fa-shield-alt"></i> Secure editorial workspace</div>
                <h3>Content control center</h3>
                <p>Edit the whole website experience, publish new vlogs, and keep every section polished from one place.</p>
              </div>
              <div className="admin-hero-stats">
                <div className="admin-stat-card"><span>Sections</span><strong>7</strong></div>
                <div className="admin-stat-card"><span>Vlogs</span><strong>{vlogs.length}</strong></div>
                <div className="admin-stat-card"><span>Status</span><strong>Live</strong></div>
              </div>
            </div>

            <div className="admin-login-card">
              <div className="admin-login">
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={adminUser} 
                  onChange={(e) => setAdminUser(e.target.value)} 
                  disabled={isVerifyingLogin}
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={adminPass} 
                  onChange={(e) => setAdminPass(e.target.value)} 
                  disabled={isVerifyingLogin}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdminLogin();
                  }}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleAdminLogin} 
                  disabled={isVerifyingLogin}
                >
                  {isVerifyingLogin ? (
                    <><i className="fas fa-spinner fa-spin"></i> Verifying...</>
                  ) : (
                    <>Login <i className="fas fa-sign-in-alt"></i></>
                  )}
                </button>
              </div>
              <div className="admin-hint">Demo access: admin / grounded2026</div>
            </div>

            {isAdmin && (
              <div className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <div className="admin-badge"><i className="fas fa-broadcast-tower"></i> Editorial tools online</div>
                    <h4>Manage your site content</h4>
                  </div>
                  <div className="admin-live-pill"><span></span> Live editing enabled</div>
                </div>

                {/* Database Sync Status & Actions */}
                <div className="admin-sync-bar">
                  <div className="sync-status-info">
                    {dbSyncStatus === 'loading' && (
                      <span className="status-badge status-loading">
                        <i className="fas fa-spinner fa-spin"></i> Checking cloud database...
                      </span>
                    )}
                    {dbSyncStatus === 'synced' && (
                      <span className="status-badge status-synced">
                        <i className="fas fa-check-circle"></i> Synced with live site
                      </span>
                    )}
                    {dbSyncStatus === 'local-only' && (
                      <span className="status-badge status-local">
                        <i className="fas fa-info-circle"></i> Local draft (database not connected)
                      </span>
                    )}
                    {dbSyncStatus === 'unsaved' && (
                      <span className="status-badge status-unsaved">
                        <i className="fas fa-exclamation-triangle"></i> Unsaved changes (local draft)
                      </span>
                    )}
                    {dbSyncStatus === 'error' && (
                      <span className="status-badge status-error">
                        <i className="fas fa-times-circle"></i> Database connection error
                      </span>
                    )}
                  </div>

                  <div className="sync-actions">
                    <button 
                      className={`btn ${dbSyncStatus === 'unsaved' || dbSyncStatus === 'local-only' ? 'btn-primary' : 'btn-outline'}`}
                      disabled={publishStatus === 'publishing' || !supabase}
                      onClick={async () => {
                        const success = await publishChanges(adminPass);
                        if (success) {
                          alert('Changes successfully published to the live site!');
                        }
                      }}
                      style={{ padding: '8px 16px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      {publishStatus === 'publishing' ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i> Publishing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-cloud-upload-alt"></i> Publish Changes to Live Site
                        </>
                      )}
                    </button>
                    {!supabase && (
                      <span className="sync-help-text" style={{ marginLeft: '12px', fontSize: '12px', opacity: 0.6 }}>
                        Connect Supabase to publish changes globally.
                      </span>
                    )}
                  </div>
                </div>

                {publishStatus === 'error' && publishError && (
                  <div className="admin-sync-banner banner-error" style={{ margin: '12px 0', padding: '12px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-exclamation-circle"></i> <span><strong>Publish Error:</strong> {publishError}</span>
                  </div>
                )}
                {publishStatus === 'success' && (
                  <div className="admin-sync-banner banner-success" style={{ margin: '12px 0', padding: '12px', borderRadius: '6px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-check-circle"></i> <span>Changes published successfully! They are now live on the website.</span>
                  </div>
                )}
                <div className="admin-tabs">
                  {['site', 'home', 'story', 'services', 'values', 'contact', 'vlogs'].map(tab => (
                    <button key={tab} className={`admin-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                  ))}
                </div>
                {activeTab === 'site' && renderSiteMeta()}
                {activeTab === 'home' && renderHome()}
                {activeTab === 'story' && renderStory()}
                {activeTab === 'services' && renderServices()}
                {activeTab === 'values' && renderValues()}
                {activeTab === 'contact' && renderContact()}
                {activeTab === 'vlogs' && (
                  <div className="admin-section">
                    <h5>Blog / Vlogs</h5>
                    <div className="form-grid">
                      <div className="form-grid-full">
                        <input type="text" placeholder="Vlog Title" value={vlogTitle} onChange={(e) => setVlogTitle(e.target.value)} style={{ color: '#fff' }} />
                      </div>
                      <div className="form-grid-full">
                        <textarea placeholder="Vlog content / description..." value={vlogContent} onChange={(e) => setVlogContent(e.target.value)} style={{ color: '#fff' }} />
                      </div>
                      <div>
                        <label>Attach an image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} />
                      </div>
                      <div>
                        <label>YouTube video URL</label>
                        <input type="text" placeholder="https://www.youtube.com/watch?v=..." value={vlogVideoUrl} onChange={(e) => setVlogVideoUrl(e.target.value)} style={{ color: '#fff' }} />
                      </div>
                      {vlogImage && (
                        <div className="form-grid-full">
                          <img src={vlogImage} alt="Preview" className="media-preview" />
                        </div>
                      )}
                      <div>
                        <button className="btn btn-primary" onClick={postVlog}>{editingVlogId ? 'Update Vlog' : 'Publish Vlog'} <i className="fas fa-upload"></i></button>
                        {editingVlogId && <button className="btn btn-outline" style={{ marginLeft: '8px' }} onClick={resetVlogForm}>Cancel</button>}
                      </div>
                    </div>
                    <div className="vlog-list">
                      {vlogs.map(vlog => (
                        <div className="vlog-item" key={vlog.id}>
                          <div className="vlog-item-actions">
                            <button className="btn btn-outline" onClick={() => startEditVlog(vlog)}>Edit</button>
                            <button className="btn btn-primary" onClick={() => deleteVlog(vlog.id)}>Delete</button>
                          </div>
                          <h4>{vlog.title}</h4>
                          <p>{vlog.content}</p>
                          {vlog.image && <img src={vlog.image} alt={vlog.title} className="media-preview" />}
                          {vlog.videoUrl && <div className="video-frame"><iframe src={vlog.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/','www.youtube.com/embed/')} title={vlog.title} allowFullScreen /></div>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
