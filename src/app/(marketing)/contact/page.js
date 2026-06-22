'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function ContactPage() {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error('Error fetching contact settings:', err));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', text: data.message });
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
      } else {
        setStatus({ type: 'error', text: data.message });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Something went wrong. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,74,173,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Header Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">Contact Us</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              Connect with our <span className="text-gradient">Architects</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              Schedule a strategy call or request infrastructure security audits. We typically respond within 2 hours.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={{ position: 'relative', zIndex: 10, paddingBottom: '6rem' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '4rem', alignItems: 'flex-start' }}>
            
            {/* Info and Map */}
            <div>
              <AnimatedSection direction="right">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '2.5rem' }}>
                  <div className="glass-panel" style={{ display: 'flex', gap: '15px', padding: '20px', alignItems: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(0,74,173,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Email Our Team</div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>{settings.email}</div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ display: 'flex', gap: '15px', padding: '20px', alignItems: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(0,74,173,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Direct Line</div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>{settings.phone}</div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ display: 'flex', gap: '15px', padding: '20px', alignItems: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(0,74,173,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Business Hours</div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>{settings.hours}</div>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ display: 'flex', gap: '15px', padding: '20px', alignItems: 'center' }}>
                    <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: 'rgba(0,74,173,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Corporate HQ</div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>{settings.address}</div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div style={{ height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,74,173,0.04)' }}>
                  <iframe 
                    src={settings.map_url} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    title="Corporate Office Map"
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* Form */}
            <div className="glass-panel" style={{ padding: '3rem' }}>
              <AnimatedSection direction="left">
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Consultation Intake Form</h3>
                
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Corporate Email</label>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">Service of Interest</label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="form-control"
                    >
                      <option value="">Select an option</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="AI & Smart Automation">AI & Smart Automation</option>
                      <option value="Cybersecurity Systems">Cybersecurity Systems</option>
                      <option value="Custom Software Engineering">Custom Software Engineering</option>
                      <option value="Product Strategy">Product Strategy</option>
                      <option value="Global Infrastructure">Global Infrastructure</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" htmlFor="message">Project Scope & Timeline</label>
                    <textarea
                      id="message"
                      required
                      placeholder="Briefly describe your objectives..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-control"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                  >
                    {loading ? (
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        Submit Proposal Request
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  {status.text && (
                    <div 
                      style={{ 
                        marginTop: '20px', 
                        padding: '12px 18px', 
                        borderRadius: '8px', 
                        fontSize: '0.94rem', 
                        fontWeight: 600,
                        backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                        color: status.type === 'success' ? '#166534' : '#991b1b',
                        border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                      }}
                    >
                      {status.text}
                    </div>
                  )}
                </form>
              </AnimatedSection>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
