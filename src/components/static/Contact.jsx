"use client"
import { useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // mailto fallback — no backend needed
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    const subject = encodeURIComponent(form.subject || 'MyCalcFinance Contact')
    window.location.href = `mailto:contact@mycalcfinance.com?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  return (
    <main className="main-content" style={{ maxWidth: 700 }}>
      
      <Breadcrumb items={[{ label: 'Contact' }]} />

      <div className="calc-header">
        <h1 style={{ background: 'none', WebkitTextFillColor: 'var(--text-primary)' }}>Contact Us</h1>
        <p>Have a question, feedback, or need help with a calculator? We'd love to hear from you.</p>
      </div>

      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Thanks for reaching out!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Your email client should have opened with the message. If not, you can email us directly at <a href="mailto:contact@mycalcfinance.com">contact@mycalcfinance.com</a>.</p>
        </div>
      ) : (
        <div className="card">
          <form className="calc-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" className="form-input" value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="form-input" value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select className="form-select" value={form.subject}
                onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))}>
                <option value="">Select a topic...</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Feature Request">Feature Request</option>
                <option value="General Question">General Question</option>
                <option value="Partnership / Business">Partnership / Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea className="form-input" rows={5} value={form.message}
                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                style={{ resize: 'vertical', minHeight: '120px' }} required />
            </div>
            <button type="submit" className="btn-calculate">Send Message</button>
          </form>
        </div>
      )}

      <div className="seo-content" style={{ marginTop: '2rem' }}>
        <h3>Other Ways to Reach Us</h3>
        <p>
          Email us directly at <a href="mailto:contact@mycalcfinance.com">contact@mycalcfinance.com</a>. We typically respond within 24-48 hours.
        </p>
      </div>
    </main>
  )
}
