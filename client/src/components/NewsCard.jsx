import { useState } from 'react';
export default function NewsCard({ article }) {
  const [speaking, setSpeaking] = useState(false);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleSpeak = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = [article.title, article.description].filter(Boolean).join('. ');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <a href={article.url || '#'} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <div className="news-card" style={{ position: 'relative' }}>
        {article.image && (
          <img src={article.image} alt={article.title} onError={e => e.target.style.display = 'none'} />
        )}
        <div className="news-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div className="news-card-source">✿ {article.source?.name || 'News Atlas'}</div>
            <button
              onClick={handleSpeak}
              title={speaking ? 'Stop reading' : 'Read aloud'}
              style={{
                flexShrink: 0,
                background: speaking ? 'var(--rose)' : 'var(--parchment)',
                border: `1px solid ${speaking ? 'var(--rose)' : 'var(--border)'}`,
                borderRadius: '50%',
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.75rem',
                transition: 'all 0.2s',
                color: speaking ? '#fff' : 'var(--ink-muted)',
              }}
            >
              {speaking ? '⏹' : '🔊'}
            </button>
          </div>
          <div className="news-card-title">{article.title}</div>
          {article.description && (
            <p style={{
              fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '0.5rem',
              lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300
            }}>
              {article.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="news-card-date">{timeAgo(article.publishedAt)}</div>
            {speaking && (
              <span style={{
                fontSize: '0.65rem', color: 'var(--rose)',
                fontStyle: 'italic', animation: 'pulse 1.5s infinite'
              }}>
                🎙 Reading...
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}