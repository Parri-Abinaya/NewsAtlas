import { useEffect, useState } from 'react';
import { submitFeedback } from '../services/api';

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.message.trim()) errors.message = 'Message is required';
  else if (form.message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'

  useEffect(() => {
    document.title = 'Contact — News Atlas';
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      await submitFeedback(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
    setSubmitting(false);
  };

  return (
    <main className="main-content page-wrapper">
      <div className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-eyebrow">// GET IN TOUCH</div>
        <h1 className="hero-title">
          We'd Love to <span className="accent">Hear From You</span>
        </h1>
        <p className="hero-subtitle">
          Have feedback, suggestions, or questions about News Atlas?
          Drop us a message below.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 680 }}>
        {status === 'success' && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>
            ✅ Thank you! Your feedback has been received. We appreciate it.
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            ❌ Something went wrong. Please try again or check your connection.
          </div>
        )}

        <div className="card" style={{ marginBottom: '3rem' }}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                className="form-textarea"
                placeholder="Share your thoughts, suggestions, or feedback..."
                value={form.message}
                onChange={handleChange}
                rows={5}
              />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
              disabled={submitting}
            >
              {submitting ? '⏳ Sending...' : '📩 Send Feedback'}
            </button>
          </form>
        </div>

        {/* Contact info cards */}
        <div className="grid-3" style={{ marginBottom: '3rem' }}>
          {[
            { icon: '💬', title: 'Community', desc: 'Join the discussion on GitHub' },
            { icon: '🐛', title: 'Bug Reports', desc: 'Open an issue on GitHub' },
            { icon: '💡', title: 'Feature Ideas', desc: 'Use the form above' },
          ].map(c => (
            <div key={c.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{c.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{c.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
