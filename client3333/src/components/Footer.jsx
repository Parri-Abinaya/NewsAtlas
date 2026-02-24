import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 400 }}>
          🌸 News<em style={{ color: 'var(--rose)', fontStyle: 'italic' }}>Atlas</em>
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--ink-subtle)' }}>Home</Link>
        <Link to="/markets" style={{ color: 'var(--ink-subtle)' }}>Markets</Link>
        <Link to="/news" style={{ color: 'var(--ink-subtle)' }}>News</Link>
        <Link to="/about" style={{ color: 'var(--ink-subtle)' }}>About</Link>
        <Link to="/contact" style={{ color: 'var(--ink-subtle)' }}>Contact</Link>
      </div>
      <div>© {new Date().getFullYear()} News Atlas — Crafted with 🌿 React, Express & Claude AI</div>
    </footer>
  );
}
