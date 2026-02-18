import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700 }}>
          🌍 News<span style={{ color: 'var(--accent)' }}>Atlas</span>
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--text-subtle)' }}>Home</Link>
        <Link to="/markets" style={{ color: 'var(--text-subtle)' }}>Markets</Link>
        <Link to="/about" style={{ color: 'var(--text-subtle)' }}>About</Link>
        <Link to="/contact" style={{ color: 'var(--text-subtle)' }}>Contact</Link>
      </div>
      <div style={{ color: 'var(--text-subtle)' }}>
        © {new Date().getFullYear()} News Atlas — Powered by React, Express & Claude AI
      </div>
    </footer>
  );
}
