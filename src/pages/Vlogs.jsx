import React from 'react';

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/watch?v=')) {
    return trimmed.replace('watch?v=', 'embed/');
  }
  if (trimmed.includes('youtu.be/')) {
    return trimmed.replace('https://youtu.be/', 'https://www.youtube.com/embed/');
  }
  return trimmed;
};

const Vlogs = ({ vlogs = [] }) => {
  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="section-badge" style={{ marginBottom: '8px' }}>Stories & Updates</div>
          <h2>Vlogs</h2>
          <p>Thoughts, lessons, and updates from the Grounded Impact team.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {vlogs.length > 0 ? (
            <div className="vlog-page-list">
              {vlogs.map((vlog) => (
                <article className="vlog-card" key={vlog.id}>
                  <div className="vlog-meta">Latest update</div>
                  <div className="vlog-card-body">
                    <div className="vlog-card-copy">
                      <h3>{vlog.title}</h3>
                      <p>{vlog.content}</p>
                    </div>
                    {(vlog.image || vlog.videoUrl) && (
                      <div className="vlog-card-media">
                        {vlog.image && <img src={vlog.image} alt={vlog.title} className="media-preview" />}
                        {vlog.videoUrl && (
                          <div className="video-frame">
                            <iframe src={getYouTubeEmbedUrl(vlog.videoUrl)} title={vlog.title} allowFullScreen />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              No vlogs have been published yet. Add one from the admin portal to get started.
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Vlogs;
