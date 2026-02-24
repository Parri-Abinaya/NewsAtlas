export default function NewsCard({ article }) {
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <a href={article.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="news-card">
        {article.image && (
          <img src={article.image} alt={article.title} onError={e => e.target.style.display = 'none'} />
        )}
        <div className="news-card-body">
          <div className="news-card-source">✿ {article.source?.name || 'News Atlas'}</div>
          <div className="news-card-title">{article.title}</div>
          {article.description && (
            <p style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '0.5rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300 }}>
              {article.description}
            </p>
          )}
          <div className="news-card-date">{timeAgo(article.publishedAt)}</div>
        </div>
      </div>
    </a>
  );
}
