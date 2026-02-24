import { useEffect, useState } from 'react';
import { submitFeedback } from '../services/api';

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'At least 10 characters please';
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { document.title = 'Contact — News Atlas'; }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFeedback(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
    setSubmitting(false);
  };

  return (
    <main className="main-content page-wrapper">
      <div className="petal-bg" />

      <div style={{
        background: 'linear-gradient(135deg, rgba(122,158,126,0.1) 0%, var(--parchment) 50%, var(--blush) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -10, left: '5%', fontSize: '6rem', opacity: 0.04, pointerEvents: 'none' }}>🌻</div>
        <div style={{ position: 'absolute', bottom: -10, right: '8%', fontSize: '5rem', opacity: 0.05, pointerEvents: 'none' }}>🌺</div>
        <div className="section-eyebrow">Say Hello</div>
        <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}>
          We'd Love to <em>Hear From You</em>
        </h1>
        <div className="hero-divider">❀ ✿ ❀</div>
        <p style={{ color: 'var(--ink-muted)', font: '300 1rem var(--font-body)', fontStyle: 'italic', maxWidth: 460, margin: '1.25rem auto 0' }}>
          Have feedback, suggestions, or just want to say hello? Drop us a message.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 680, padding: '3rem 1.5rem' }}>
        {status === 'success' && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            🌸 Thank you! Your message has been received. We appreciate it.
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            🥀 Something went wrong. Please try again.
          </div>
        )}

        <div className="card" style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--rose-dark)' }}>
            Send a Message ✿
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input type="text" name="name" className="form-input" placeholder="Jane Doe" value={form.name} onChange={handleChange} />
              {errors.name && <div className="form-error">🌷 {errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="jane@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <div className="form-error">🌷 {errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea name="message" className="form-textarea" placeholder="Share your thoughts, suggestions, or feedback..." value={form.message} onChange={handleChange} rows={5} />
              {errors.message && <div className="form-error">🌷 {errors.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }} disabled={submitting}>
              {submitting ? '🌸 Sending...' : '📩 Send Message'}
            </button>
          </form>
        </div>

        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {[
            { icon: '💬', title: 'Community', desc: 'Join the discussion on GitHub' },
            { icon: '🐛', title: 'Bug Reports', desc: 'Open an issue on GitHub' },
            { icon: '💡', title: 'Feature Ideas', desc: 'Use the form above' },
          ].map(c => (
            <div key={c.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{c.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, marginBottom: '0.25rem' }}>{c.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--ink-muted)', fontWeight: 300 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="ornament">❀ ✿ ❀ ✿ ❀</div>
      </div>
    </main>
  );
}
