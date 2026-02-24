import { useState, useEffect } from 'react';
import WorldMap from '../components/WorldMap';
import CountrySearch from '../components/CountrySearch';
import NewsCard from '../components/NewsCard';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { getFeaturedNews } from '../services/api';

const QUICK_STATS = [
  { label: 'Countries', value: '195', sub: 'UN recognized' },
  { label: 'Languages', value: '7,000+', sub: 'worldwide' },
  { label: 'News Sources', value: '50+', sub: 'outlets tracked' },
  { label: 'Updates', value: 'Real-time', sub: 'data refresh' },
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

      <div className="hero">
        <p className="hero-script">Explore the world</p>
        <h1 className="hero-title">
          News Atlas — <em>one country at a time</em>
        </h1>
        <p className="hero-subtitle">
          Click any country on the map to discover its latest news,
          live weather, currency rates, and key facts.
        </p>
        <CountrySearch />
      </div>

      <div className="container" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>World Map</h2>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.78rem', color: 'var(--green)' }}>
            <span className="live-dot" />Live
          </span>
        </div>
        {lastClicked && (
          <p style={{ marginBottom: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Last explored: <strong>{lastClicked}</strong>
          </p>
        )}
        <WorldMap onCountryClick={(code, name) => setLastClicked(name)} />
      </div>

      <div className="container" style={{ marginBottom: '40px' }}>
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

      <div className="container" style={{ marginBottom: '56px' }}>
        <h2 className="section-title">Global Headlines</h2>
        <p className="section-sub">Latest stories from around the world</p>
        <div className="news-grid">
          {newsLoading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : news.slice(0, 9).map((article, i) => <NewsCard key={i} article={article} />)
          }
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/news" className="btn btn-ghost">View all global news →</a>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)', padding: '40px 20px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: '8px' }}>Track Global Markets</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
          Indices, currencies, and commodities updated in real time.
        </p>
        <a href="/markets" className="btn btn-primary">View Markets →</a>
      </div>

    </main>
  );
}
