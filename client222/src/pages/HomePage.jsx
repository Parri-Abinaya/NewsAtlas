import { useState, useEffect } from 'react';
import { useEffect as useDocTitle } from 'react';
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
      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">// LIVE WORLD NEWS PLATFORM</div>
        <h1 className="hero-title">
          Explore the World<br />
          <span className="accent">One Click at a Time</span>
        </h1>
        <p className="hero-subtitle">
          Click any country on the map to instantly discover its latest news,
          live weather, currency rates, and key facts.
        </p>
        <CountrySearch />
      </div>

      {/* Map */}
      <div className="container" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Interactive World Map</h2>
          <span className="live-dot" /><span style={{ fontSize: '0.75rem', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>Live</span>
        </div>
        {lastClicked && (
          <div style={{ marginBottom: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
            Last explored: {lastClicked}
          </div>
        )}
        <WorldMap onCountryClick={(code, name) => setLastClicked(name)} />
      </div>

      {/* Quick stats */}
      <div className="container" style={{ marginBottom: '3rem' }}>
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

      {/* Featured News */}
      <div className="container" style={{ marginBottom: '4rem' }}>
        <h2 className="section-title">Global Headlines</h2>
        <p className="section-sub">Latest stories from around the world</p>
        <div className="news-grid">
          {newsLoading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : news.slice(0, 9).map((article, i) => (
                <NewsCard key={i} article={article} />
              ))
          }
        </div>
      </div>

      {/* CTA Band */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(0,212,170,0.08), rgba(59,130,246,0.08))',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <div className="hero-eyebrow">EXPLORE MORE</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          Markets Moving Right Now
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Track indices, currencies, and commodities in real time.
        </p>
        <a href="/markets" className="btn btn-primary">View Global Markets →</a>
      </div>
    </main>
  );
}
