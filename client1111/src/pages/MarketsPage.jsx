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

  const fmt = v => `${v >= 0 ? '+' : ''}${v?.toFixed(2)}%`;

  if (loading) return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '48px 20px' }}><Spinner /></div>
    </main>
  );

  return (
    <main className="main-content page-wrapper">

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '40px 20px 32px' }}>
        <div className="container" style={{ padding: 0 }}>
          <p className="section-eyebrow">Real-time data</p>
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Global Markets</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-dot" />
            <span style={{ fontSize: '0.8rem', color: 'var(--green)' }}>Live market data</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 20px' }}>

        <div className="stats-row" style={{ marginBottom: '32px' }}>
          {data?.indices?.slice(0, 4).map(idx => (
            <div key={idx.symbol} className="stat-card">
              <div className="stat-label">{idx.symbol}</div>
              <div className="stat-value" style={{ fontSize: '1.1rem' }}>{idx.value?.toLocaleString()}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 500, color: idx.changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {fmt(idx.changePercent)}
              </div>
            </div>
          ))}
        </div>

        <div className="tabs">
          <button className={`tab ${tab === 'indices' ? 'active' : ''}`} onClick={() => setTab('indices')}>Indices</button>
          <button className={`tab ${tab === 'currencies' ? 'active' : ''}`} onClick={() => setTab('currencies')}>Currencies</button>
          <button className={`tab ${tab === 'commodities' ? 'active' : ''}`} onClick={() => setTab('commodities')}>Commodities</button>
        </div>

        {tab === 'indices' && (
          <div>
            <div className="card" style={{ marginBottom: '16px' }}>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.indices}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="symbol" tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <YAxis tick={{ fill: 'var(--text-faint)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.8rem' }} />
                  <Bar dataKey="changePercent" name="Change %" radius={[3,3,0,0]}>
                    {data?.indices?.map((e, i) => <Cell key={i} fill={e.changePercent >= 0 ? '#2d7a4f' : '#b45c4a'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <table className="market-table">
                <thead><tr><th>Index</th><th>Symbol</th><th>Value</th><th>Change</th></tr></thead>
                <tbody>
                  {data?.indices?.map(idx => (
                    <tr key={idx.symbol}>
                      <td><strong>{idx.name}</strong></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{idx.symbol}</td>
                      <td>{idx.value?.toLocaleString()}</td>
                      <td className={idx.changePercent >= 0 ? 'change-pos' : 'change-neg'}>{fmt(idx.changePercent)}</td>
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
                    <td><strong>{c.pair}</strong></td>
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
                    <td><strong>{c.name}</strong></td>
                    <td>${c.price?.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-faint)', fontSize: '0.82rem' }}>/{c.unit}</td>
                    <td className={c.change >= 0 ? 'change-pos' : 'change-neg'}>{c.change >= 0 ? '+' : ''}{c.change?.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-faint)', textAlign: 'right' }}>
          Last updated: {data?.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : 'N/A'}
        </p>
      </div>

    </main>
  );
}
