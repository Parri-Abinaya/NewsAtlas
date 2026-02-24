import { useState, useEffect } from 'react';
import WorldMap from '../components/WorldMap';
import CountrySearch from '../components/CountrySearch';
import NewsCard from '../components/NewsCard';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { getFeaturedNews } from '../services/api';

const QUICK_STATS = [
  { label: 'Countries', value: '195', sub: 'UN recognized' },
  { label: 'Languages', value: '7,000+', sub: 'worldwide' },
  { label: 'Live Sources', value: '50+', sub: 'news outlets' },
  { label: 'Updates', value: 'Real-time', sub: 'data refresh' }
];

export default function HomePage() {
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);

  useEffect(() => {
    document.title = 'News Atlas — Explore the World';
    getFeaturedNews()
      .then(setNews)
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <main className="main-content page-wrapper">
      <div className="petal-bg" />

      {/* Hero */}
      <div className="hero">
        <div className="hero-florals">
          <span>🌸</span><span>🌺</span><span>🌼</span>
          <span>🌷</span><span>🌻</span><span>💐</span>
        </div>
        <div className="hero-script">Welcome to</div>
        <h1 className="hero-title">
          News <em>Atlas</em>
        </h1>
        <div className="hero-divider">❀ ✿ ❀</div>
        <p className="hero-subtitle">
          Click any country on the map to discover its latest news,
          live weather, currency exchange & key facts — all in one place.
        </p>
        <CountrySearch />
      </div>

      {/* Map */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="section-eyebrow">Explore</div>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Interactive World Map</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.75rem', color: 'var(--sage-dark)', fontStyle: 'italic' }}>Live data</span>
          </div>
        </div>
        {lastClicked && (
          <p style={{ marginBottom: '0.75rem', fontSize: '0.82rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
            🌸 Last explored: <strong>{lastClicked}</strong>
          </p>
        )}
        <WorldMap onCountryClick={(code, name) => setLastClicked(name)} />
      </div>

      {/* Quick stats */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="stats-row">
          {QUICK_STATS.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="ornament">❀ ✿ ❀ ✿ ❀</div>

      {/* Featured News */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <div className="section-eyebrow">Today's Stories</div>
        <h2 className="section-title">Global Headlines</h2>
        <p className="section-sub">Latest stories gathered from around the world</p>
        <div className="news-grid">
          {newsLoading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : news.slice(0, 9).map((article, i) => <NewsCard key={i} article={article} />)
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="/news" className="btn btn-ghost">View All Global News →</a>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blush) 0%, var(--parchment) 50%, rgba(122,158,126,0.1) 100%)',
        borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
        padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.04, fontSize: '12rem', pointerEvents: 'none' }}>🌸</div>
        <div className="section-eyebrow">Discover More</div>
        <h2 className="section-title">Markets Moving Right Now</h2>
        <p className="section-sub" style={{ maxWidth: 400, margin: '0 auto 2rem' }}>
          Track global indices, currencies, and commodities in real time.
        </p>
        <a href="/markets" className="btn btn-primary">View Global Markets 🌿</a>
      </div>
    </main>
  );
}
