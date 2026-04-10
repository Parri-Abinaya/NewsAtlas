import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      const token = await user.getIdToken();
      // Sync to your MongoDB backend
      await axios.post('/api/auth/register', { name, email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists.'
        : 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <main className="main-content page-wrapper">
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 440, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🗺</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 400, fontStyle: 'italic', marginBottom: '0.25rem' }}>
            Join the Atlas
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: '0.875rem' }}>Create your News Atlas account</p>
        </div>

        <div className="card">
          {error && (
            <div style={{ background: 'var(--blush)', border: '1px solid var(--rose)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--rose-dark)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Full Name', type: 'text', val: name, set: setName, ph: 'Jane Doe' },
              { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
              { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
            ].map(({ label, type, val, set, ph }) => (
              <div key={label}>
                <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', display: 'block', marginBottom: '0.4rem' }}>
                  {label}
                </label>
                <input
                  type={type}
                  className="search-input"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                  placeholder={ph}
                  value={val}
                  onChange={e => set(e.target.value)}
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--rose)', textDecoration: 'none', fontStyle: 'italic' }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}