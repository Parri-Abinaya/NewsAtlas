import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        🌸 News<em>Atlas</em>
      </NavLink>

      <ul className="navbar-links">
        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/markets" className={({ isActive }) => isActive ? 'active' : ''}>Markets</NavLink></li>
        <li><NavLink to="/news" className={({ isActive }) => isActive ? 'active' : ''}>News</NavLink></li>
        <li><NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink></li>
      </ul>

      <button className="theme-toggle">🌿 Theme</button>
    </nav>
  );
}
