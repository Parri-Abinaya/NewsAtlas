import { useEffect, useState } from 'react';
import { getMarkets } from '../services/api';
import { Spinner } from '../components/LoadingSkeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export default function MarketsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('indices');

  useEffect(() => {
    document.title = 'Global Markets — News Atlas';
    getMarkets()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const formatChange = (val) => {
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val?.toFixed(2)}%`;
  };

  if (loading) return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <Spinner />
      </div>
    </main>
  );

  return (
    <main className="main-content page-wrapper">
      <div className="section">
        <div className="container">
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="live-dot" /><span style={{ fontSize: '0.75rem', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>LIVE DATA</span>
          </div>
          <h1 className="section-title">Global Markets</h1>
          <p className="section-sub">Major indices, currencies, and commodities at a glance</p>

          {/* Index mini cards */}
          <div className="stats-row" style={{ marginBottom: '3rem' }}>
            {data?.indices?.slice(0, 4).map(idx => (
              <div key={idx.symbol} className="stat-card">
                <div className="stat-label">{idx.symbol}</div>
                <div className="stat-value" style={{ fontSize: '1.2rem' }}>{idx.value?.toLocaleString()}</div>
                <div className="stat-sub" style={{ color: idx.changePercent >= 0 ? 'var(--success)' : 'var(--danger)' }}>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="symbol" tick={{ fill: 'var(--text-subtle)', fontSize: 11 }} />
                    <YAxis tick={{ fill: 'var(--text-subtle)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}
                    />
                    <Bar dataKey="changePercent" name="Change %">
                      {data?.indices?.map((entry, i) => (
                        <Cell key={i} fill={entry.changePercent >= 0 ? '#3fb950' : '#f85149'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card">
                <table className="market-table">
                  <thead>
                    <tr>
                      <th>Index</th>
                      <th>Symbol</th>
                      <th>Value</th>
                      <th>Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.indices?.map(idx => (
                      <tr key={idx.symbol}>
                        <td><strong>{idx.name}</strong></td>
                        <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{idx.symbol}</span></td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{idx.value?.toLocaleString()}</td>
                        <td className={idx.changePercent >= 0 ? 'change-pos' : 'change-neg'} style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          {formatChange(idx.changePercent)}
                        </td>
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
                <thead>
                  <tr>
                    <th>Currency Pair</th>
                    <th>Rate</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.currencies?.map(c => (
                    <tr key={c.pair}>
                      <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{c.pair}</strong></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.rate?.toFixed(4)}</td>
                      <td className={c.change >= 0 ? 'change-pos' : 'change-neg'} style={{ fontFamily: 'var(--font-mono)' }}>
                        {c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'commodities' && (
            <div className="card">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>Commodity</th>
                    <th>Price (USD)</th>
                    <th>Unit</th>
                    <th>24h Change</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.commodities?.map(c => (
                    <tr key={c.name}>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${c.price?.toFixed(2)}</td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/{c.unit}</td>
                      <td className={c.change >= 0 ? 'change-pos' : 'change-neg'} style={{ fontFamily: 'var(--font-mono)' }}>
                        {c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div style={{ marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-subtle)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>
            Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : 'N/A'}
          </div>
        </div>
      </div>
    </main>
  );
}
