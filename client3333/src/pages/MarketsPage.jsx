import { useEffect, useState } from 'react';
import { getMarkets } from '../services/api';
import { Spinner } from '../components/LoadingSkeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function MarketsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('indices');

  useEffect(() => {
    document.title = 'Global Markets — News Atlas';
    getMarkets().then(setData).catch(() => setData(null)).finally(() => setLoading(false));
  }, []);

  const formatChange = (val) => `${val >= 0 ? '+' : ''}${val?.toFixed(2)}%`;

  if (loading) return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem' }}><Spinner /></div>
    </main>
  );

  return (
    <main className="main-content page-wrapper">
      <div className="petal-bg" />

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(201,169,110,0.15) 0%, var(--parchment) 50%, var(--blush) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '4rem 2rem 3rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -10, right: '5%', fontSize: '6rem', opacity: 0.04, pointerEvents: 'none' }}>🌼</div>
        <div className="section-eyebrow">Real-time Data</div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          Global <em>Markets</em>
        </h1>
        <div className="hero-divider">❀ ✿ ❀</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.82rem', color: 'var(--sage-dark)', fontStyle: 'italic' }}>Live market data</span>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
        {/* Mini index cards */}
        <div className="stats-row" style={{ marginBottom: '3rem' }}>
          {data?.indices?.slice(0, 4).map(idx => (
            <div key={idx.symbol} className="stat-card">
              <div className="stat-label">{idx.symbol}</div>
              <div className="stat-value" style={{ fontSize: '1.2rem' }}>{idx.value?.toLocaleString()}</div>
              <div className="stat-sub" style={{ color: idx.changePercent >= 0 ? 'var(--sage-dark)' : 'var(--rose-dark)', fontStyle: 'normal', fontWeight: 500 }}>
                {formatChange(idx.changePercent)}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'indices' ? 'active' : ''}`} onClick={() => setTab('indices')}>📊 Indices</button>
          <button className={`tab ${tab === 'currencies' ? 'active' : ''}`} onClick={() => setTab('currencies')}>💱 Currencies</button>
          <button className={`tab ${tab === 'commodities' ? 'active' : ''}`} onClick={() => setTab('commodities')}>🛢 Commodities</button>
        </div>

        {tab === 'indices' && (
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data?.indices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                  <XAxis dataKey="symbol" tick={{ fill: 'var(--ink-subtle)', fontSize: 11, fontFamily: 'Jost' }} />
                  <YAxis tick={{ fill: 'var(--ink-subtle)', fontSize: 11, fontFamily: 'Jost' }} />
                  <Tooltip contentStyle={{ background: 'var(--warm-white)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '0.8rem', fontFamily: 'Jost' }} />
                  <Bar dataKey="changePercent" name="Change %" radius={[4,4,0,0]}>
                    {data?.indices?.map((entry, i) => (
                      <Cell key={i} fill={entry.changePercent >= 0 ? '#7a9e7e' : '#c17b6e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <table className="market-table">
                <thead>
                  <tr><th>Index</th><th>Symbol</th><th>Value</th><th>Change %</th></tr>
                </thead>
                <tbody>
                  {data?.indices?.map(idx => (
                    <tr key={idx.symbol}>
                      <td><strong style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{idx.name}</strong></td>
                      <td><span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>{idx.symbol}</span></td>
                      <td style={{ fontWeight: 500 }}>{idx.value?.toLocaleString()}</td>
                      <td className={idx.changePercent >= 0 ? 'change-pos' : 'change-neg'}>{formatChange(idx.changePercent)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'currencies' && (
          <div className="card">
            <table className="market-table">
              <thead><tr><th>Pair</th><th>Rate</th><th>24h Change</th></tr></thead>
              <tbody>
                {data?.currencies?.map(c => (
                  <tr key={c.pair}>
                    <td><strong style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{c.pair}</strong></td>
                    <td>{c.rate?.toFixed(4)}</td>
                    <td className={c.change >= 0 ? 'change-pos' : 'change-neg'}>{c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'commodities' && (
          <div className="card">
            <table className="market-table">
              <thead><tr><th>Commodity</th><th>Price (USD)</th><th>Unit</th><th>24h Change</th></tr></thead>
              <tbody>
                {data?.commodities?.map(c => (
                  <tr key={c.name}>
                    <td><strong style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>{c.name}</strong></td>
                    <td>${c.price?.toFixed(2)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--ink-subtle)' }}>/{c.unit}</td>
                    <td className={c.change >= 0 ? 'change-pos' : 'change-neg'}>{c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--ink-subtle)', fontStyle: 'italic' }}>
          Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : 'N/A'} ✿
        </div>
      </div>
    </main>
  );
}
