import { useEffect, useState } from 'react';
import { submitFeedback } from '../services/api';

function validate(form) {
  const e = {};
  if (!form.name.trim()) e.name = 'Name is required';
  if (!form.email.trim()) e.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
  if (!form.message.trim()) e.message = 'Message is required';
  else if (form.message.trim().length < 10) e.message = 'At least 10 characters';
  return e;
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { document.title = 'Contact — News Atlas'; }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await submitFeedback(form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch { setStatus('error'); }
    setSubmitting(false);
  };

  return (
    <main className="main-content page-wrapper">

      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '40px 20px 32px' }}>
        <div className="container" style={{ padding: 0 }}>
          <p className="section-eyebrow">Say hello</p>
          <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '8px' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Have feedback, suggestions, or a question? Drop us a message.
          </p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 640, padding: '40px 20px' }}>

        {status === 'success' && (
          <div className="alert alert-success" style={{ marginBottom: '20px' }}>
            ✓ Thank you! Your message has been received.
          </div>
        )}
        {status === 'error' && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            Something went wrong. Please try again.
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-input" placeholder="Your name" value={form.name} onChange={handleChange} />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea name="message" className="form-textarea" placeholder="Your message..." value={form.message} onChange={handleChange} rows={5} />
              {errors.message && <div className="form-error">{errors.message}</div>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message →'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
