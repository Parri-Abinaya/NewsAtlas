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

  const filtered = news.filter(article => {
    const matchSearch = search === '' ||
      article.title?.toLowerCase().includes(search.toLowerCase()) ||
      article.description?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <main className="main-content page-wrapper">
      <div className="petal-bg" />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blush) 0%, var(--parchment) 60%, rgba(201,169,110,0.15) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '4rem 2rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, left: '5%', fontSize: '5rem', opacity: 0.05, pointerEvents: 'none' }}>🌺</div>
        <div style={{ position: 'absolute', bottom: -20, right: '5%', fontSize: '6rem', opacity: 0.05, pointerEvents: 'none' }}>🌸</div>

        <div className="section-eyebrow">Around the Globe</div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          Global <em>News</em>
        </h1>
        <div className="hero-divider">❀ ✿ ❀</div>
        <p style={{ color: 'var(--ink-muted)', font: '300 1rem var(--font-body)', fontStyle: 'italic', maxWidth: 480, margin: '1rem auto 2rem' }}>
          Stories from every corner of the world, curated and updated in real time.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
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

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Category tabs */}
        <div className="tabs" style={{ marginBottom: '2rem' }}>
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

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.8rem', color: 'var(--sage-dark)', fontStyle: 'italic' }}>
              Live feed — {filtered.length} articles
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--ink-subtle)', fontStyle: 'italic' }}>
            Updated just now ✿
          </div>
        </div>

        {/* News grid */}
        {loading ? (
          <div className="news-grid">
            {Array.from({ length: 9 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="news-grid">
            {filtered.map((article, i) => (
              <NewsCard key={i} article={article} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              No articles found
            </h3>
            <p style={{ color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              Try a different search term or category
            </p>
          </div>
        )}

        <div className="ornament" style={{ marginTop: '3rem' }}>❀ ✿ ❀ ✿ ❀</div>

        {/* Region quick links */}
        <div style={{ marginTop: '3rem' }}>
          <div className="section-eyebrow">Explore by Region</div>
          <h2 className="section-title">News by Country</h2>
          <p className="section-sub">Click a country to see their specific news feed</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {[
              { code: 'US', name: '🇺🇸 United States' },
              { code: 'GB', name: '🇬🇧 United Kingdom' },
              { code: 'IN', name: '🇮🇳 India' },
              { code: 'CN', name: '🇨🇳 China' },
              { code: 'DE', name: '🇩🇪 Germany' },
              { code: 'FR', name: '🇫🇷 France' },
              { code: 'JP', name: '🇯🇵 Japan' },
              { code: 'BR', name: '🇧🇷 Brazil' },
              { code: 'AU', name: '🇦🇺 Australia' },
              { code: 'CA', name: '🇨🇦 Canada' },
              { code: 'ZA', name: '🇿🇦 South Africa' },
              { code: 'AE', name: '🇦🇪 UAE' },
            ].map(c => (
              <a key={c.code} href={`/country/${c.code}`}>
                <div className="card" style={{
                  padding: '0.6rem 1.1rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  display: 'inline-block'
                }}>
                  {c.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
