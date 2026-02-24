import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCountryData } from '../hooks/useCountryData';
import { saveCountry, removeSavedCountry, getSavedCountries } from '../services/api';
import NewsCard from '../components/NewsCard';
import { Spinner, SkeletonText } from '../components/LoadingSkeleton';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function WeatherWidget({ weather }) {
  if (!weather) return null;
  return (
    <div className="card">
      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        🌤 Current Weather — {weather.city}
      </div>
      <div className="weather-widget">
        {weather.icon && <img src={weather.icon} alt={weather.description} style={{ width: 60 }} />}
        <div>
          <div className="weather-temp">{weather.temp}°C</div>
          <div className="weather-desc">{weather.description}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>💧 {weather.humidity}% humidity</div>
          <div>💨 {weather.windSpeed?.toFixed(1)} m/s wind</div>
          <div>👁 {weather.visibility?.toFixed(1)} km vis.</div>
        </div>
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
        Feels like {weather.feelsLike}°C
      </div>
    </div>
  );
}

function CurrencyWidget({ currency }) {
  if (!currency) return null;
  return (
    <div className="card">
      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
        💱 Currency Exchange
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent)' }}>
          {currency.symbol}{parseFloat(currency.rate).toFixed(2)}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>per USD</span>
      </div>
      <div style={{ fontSize: '0.8rem', marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
        1 USD = {currency.rate} {currency.currency} ({currency.name})
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {Object.entries(currency.popular || {}).map(([code, rate]) => (
          <div key={code} style={{ background: 'var(--surface2)', borderRadius: '6px', padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{code}</span>
            <span style={{ float: 'right', fontFamily: 'var(--font-mono)' }}>{parseFloat(rate).toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountryFacts({ facts }) {
  const items = [
    { label: 'Capital', value: facts.capital },
    { label: 'Region', value: `${facts.region}${facts.subregion ? ` / ${facts.subregion}` : ''}` },
    { label: 'Population', value: facts.population?.toLocaleString() },
    { label: 'Area', value: facts.area ? `${facts.area?.toLocaleString()} km²` : 'N/A' },
    { label: 'Languages', value: facts.languages?.slice(0, 3).join(', ') || 'N/A' },
    { label: 'Timezones', value: facts.timezones?.slice(0, 2).join(', ') || 'N/A' },
  ];

  return (
    <div className="card">
      <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
        📊 Country Facts
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '0.85rem', textAlign: 'right' }}>{value || 'N/A'}</span>
          </div>
        ))}
      </div>
      {facts.maps && (
        <a href={facts.maps} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
          🗺 View on Google Maps
        </a>
      )}
    </div>
  );
}

// Mock sparkline data
function generateSparkline() {
  let val = 100 + Math.random() * 20;
  return Array.from({ length: 12 }, (_, i) => {
    val += (Math.random() - 0.48) * 5;
    return { month: `M${i + 1}`, value: parseFloat(val.toFixed(2)) };
  });
}

export default function CountryPage() {
  const { code } = useParams();
  const { data, loading, error } = useCountryData(code?.toUpperCase());
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('news');
  const [sparkData] = useState(generateSparkline());

  useEffect(() => {
    if (data?.facts?.name) {
      document.title = `${data.facts.name} — News Atlas`;
      getSavedCountries().then(saved => {
        setIsSaved(saved.some(s => s.countryCode === code?.toUpperCase()));
      }).catch(() => {});
    }
  }, [data, code]);

  const handleSave = async () => {
    if (!data?.facts) return;
    setSaveLoading(true);
    try {
      if (isSaved) {
        await removeSavedCountry(code?.toUpperCase());
        setIsSaved(false);
      } else {
        await saveCountry({ countryCode: code?.toUpperCase(), countryName: data.facts.name });
        setIsSaved(true);
      }
    } catch (e) {}
    setSaveLoading(false);
  };

  if (loading) return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <Spinner />
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          Loading country data...
        </p>
      </div>
    </main>
  );

  if (error) return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Country Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{error}</p>
        <Link to="/" className="btn btn-primary">← Back to Map</Link>
      </div>
    </main>
  );

  const { facts, news, weather, currency, summary } = data || {};

  return (
    <main className="main-content page-wrapper">
      {/* Header */}
      <div className="country-header">
        <div className="container">
          <div style={{ marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>← Back to Atlas</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexWrap: 'wrap' }}>
            {facts?.flag && <img src={facts.flag} alt={facts.name} className="country-flag-large" />}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-region">{facts?.region}</span>
                {facts?.subregion && <span className="badge badge-pop">{facts.subregion}</span>}
                <span style={{ fontSize: '1.5rem' }}>{facts?.flagEmoji}</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, marginBottom: '0.25rem' }}>
                {facts?.name}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{facts?.officialName}</p>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Population</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent)' }}>{facts?.population?.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Capital</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{facts?.capital}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Currency</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{facts?.currencies?.[0]?.code || 'N/A'}</div>
                </div>
              </div>
            </div>
            <button
              className={`fav-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={saveLoading}
            >
              {isSaved ? '🧡 Saved' : '🤍 Save Country'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2rem 1.5rem' }}>
        {/* AI Summary */}
        {summary && (
          <div className="ai-summary" style={{ marginBottom: '2rem' }}>
            <div className="ai-badge">✦ AI Intelligence Summary</div>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text)' }}>{summary}</p>
          </div>
        )}

        {/* Weather & Currency row */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          <WeatherWidget weather={weather} />
          <CurrencyWidget currency={currency} />
        </div>

        {/* Sparkline chart */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            📈 Economic Activity Index (Simulated)
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-subtle)', fontSize: 10 }} />
              <YAxis tick={{ fill: 'var(--text-subtle)', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}
              />
              <Area type="monotone" dataKey="value" stroke="#00d4aa" strokeWidth={2} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs for news and facts */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
            📰 Latest News
          </button>
          <button className={`tab ${activeTab === 'facts' ? 'active' : ''}`} onClick={() => setActiveTab('facts')}>
            📋 Country Facts
          </button>
        </div>

        {activeTab === 'news' && (
          <div className="news-grid">
            {(news || []).map((article, i) => (
              <NewsCard key={i} article={article} />
            ))}
            {(!news || news.length === 0) && (
              <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1' }}>No news articles available at this time.</p>
            )}
          </div>
        )}

        {activeTab === 'facts' && facts && (
          <div className="grid-2">
            <CountryFacts facts={facts} />
            <div>
              {facts.borders && facts.borders.length > 0 && (
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                    🗺 Bordering Countries
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {facts.borders.map(b => (
                      <Link key={b} to={`/country/${b}`}>
                        <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.3rem 0.65rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', cursor: 'pointer', display: 'block', transition: 'border-color 0.2s' }}
                          onMouseEnter={e => e.target.style.borderColor = 'var(--accent)'}
                          onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
                        >
                          {b}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="card">
                <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                  🏦 Currencies
                </div>
                {(facts.currencies || []).map(c => (
                  <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{c.code}</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{c.symbol}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
