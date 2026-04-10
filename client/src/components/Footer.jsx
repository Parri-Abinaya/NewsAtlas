import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div style={{ marginBottom: '10px', fontFamily: 'var(--font-head)', fontSize: '1rem' }}>
        News<em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Atlas</em>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {['/', '/markets', '/news', '/about', '/contact'].map((href, i) => (
          <Link key={href} to={href} style={{ color: 'var(--text-faint)' }}>
            {['Home', 'Markets', 'News', 'About', 'Contact'][i]}
          </Link>
        ))}
      </div>
    </footer>
  );
}
