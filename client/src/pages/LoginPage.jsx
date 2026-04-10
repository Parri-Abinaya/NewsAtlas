import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌸</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, fontStyle: 'italic', marginBottom: '0.25rem' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>Sign in to your News Atlas account</p>
        </div>

        <div className="card">
          {error && (
            <div style={{ background: 'var(--blush)', border: '1px solid var(--rose)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--rose-dark)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', display: 'block', marginBottom: '0.4rem' }}>
                Email
              </label>
              <input
                type="email"
                className="search-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', display: 'block', marginBottom: '0.4rem' }}>
                Password
              </label>
              <input
                type="password"
                className="search-input"
                style={{ width: '100%', boxSizing: 'border-box' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--rose)', textDecoration: 'none', fontStyle: 'italic' }}>
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}