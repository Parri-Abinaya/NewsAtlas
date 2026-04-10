import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">News<em>Atlas</em></NavLink>
      <ul className="navbar-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/markets" className={({ isActive }) => isActive ? 'active' : ''}>Markets</NavLink></li>
        <li><NavLink to="/news" className={({ isActive }) => isActive ? 'active' : ''}>News</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="btn btn-ghost"
          style={{ fontSize: '1rem', padding: '0.3rem 0.6rem', lineHeight: 1 }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
              {user.displayName || user.email}
            </span>
            <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem' }} onClick={() => { logout(); navigate('/login'); }}>
              Sign out
            </button>
          </>
        ) : (
          <NavLink to="/login" className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.3rem 0.9rem' }}>
            Sign in
          </NavLink>
        )}
      </div>
    </nav>
  );
}