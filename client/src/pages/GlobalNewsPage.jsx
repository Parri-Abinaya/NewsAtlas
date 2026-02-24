import { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { getFeaturedNews } from '../services/api';

const CATEGORIES = ['All', 'World', 'Politics', 'Business', 'Technology', 'Science', 'Health', 'Sports'];

export default function GlobalNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'Global News — News Atlas';
    getFeaturedNews()
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = news.filter(article =>
    search === '' ||
    article.title?.toLowerCase().includes(search.toLowerCase()) ||
    article.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="main-content page-wrapper">

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '40px 20px 32px' }}>
        <div className="container" style={{ padding: 0 }}>
          <p className="section-eyebrow">Around the globe</p>
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Global News</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Stories from every corner of the world, updated in real time.
          </p>
          <div className="search-wrapper" style={{ margin: 0 }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search headlines..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 20px' }}>
        <div className="tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span className="live-dot" />{filtered.length} articles
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Updated just now</span>
        </div>

        {loading ? (
          <div className="news-grid">
            {Array.from({ length: 9 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="news-grid">
            {filtered.map((article, i) => <NewsCard key={i} article={article} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No articles found</p>
            <p style={{ fontSize: '0.875rem' }}>Try a different search term</p>
          </div>
        )}

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border)' }}>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>News by Country</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              ['US', '🇺🇸 United States'], ['GB', '🇬🇧 UK'], ['IN', '🇮🇳 India'],
              ['CN', '🇨🇳 China'], ['DE', '🇩🇪 Germany'], ['FR', '🇫🇷 France'],
              ['JP', '🇯🇵 Japan'], ['BR', '🇧🇷 Brazil'], ['AU', '🇦🇺 Australia'],
              ['CA', '🇨🇦 Canada'], ['ZA', '🇿🇦 South Africa'], ['AE', '🇦🇪 UAE'],
            ].map(([code, name]) => (
              <a key={code} href={`/country/${code}`}
                style={{
                  padding: '6px 14px', background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', fontSize: '0.85rem', color: 'var(--text-muted)',
                  transition: 'border-color 0.15s, color 0.15s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>

    </main>
  );
}
