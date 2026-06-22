'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error('Failed to load settings in Footer:', err));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const logoUrl = settings?.logo_url || '/logo.png';
  const siteName = settings?.site_name || 'Sawariya Solution';
  const description = settings?.meta_description || 'Premium technical consulting and bespoke software applications for global scale-up enterprises.';
  const email = settings?.email || 'solutions@sawariyasolution.com';
  const phone = settings?.phone || '+91 80005 51065';
  const hours = settings?.hours || 'Mon - Sat: 9:00 AM - 7:00 PM IST';
  const address = settings?.address || 'Vadodara, Gujarat, India';

  // Social Links with Inline SVGs
  const socials = [
    { svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>, url: settings?.facebook_url || '#', name: 'Facebook' },
    { svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>, url: settings?.instagram_url || '#', name: 'Instagram' },
    { svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>, url: settings?.linkedin_url || '#', name: 'LinkedIn' },
    { svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 2.022 14.12 1 11.998 1c-5.438 0-9.863 4.372-9.867 9.802-.002 1.773.475 3.5 1.378 5.061l-.997 3.642 3.734-.967zm11.067-7.713c.307-.15.524-.25.576-.341.053-.09.053-.524-.044-.805-.098-.282-.876-2.134-1.2-2.923-.316-.769-.64-.664-.876-.676l-.744-.015c-.25 0-.658.093-.102.614.556.521 2.164 2.245 2.164 5.474 0 3.23-2.316 6.322-2.624 6.74-.307.419-4.507 7.218-11.045 9.77-.306-.15-.658-.341-1.127-.524-.469-.183-1.077-.419-1.258-.469-.182-.05-.524-.09-.744.053-.22.143-.377.34-.377.533 0 .193.1.524.2.825.097.302.824 2.723 1.15 3.23.327.507.575.76.877.91z"/></svg>, url: settings?.whatsapp_num ? `https://wa.me/${settings.whatsapp_num.replace(/[+\s]/g, '')}` : '#', name: 'WhatsApp' },
    { svg: <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, url: settings?.youtube_url || '#', name: 'YouTube' }
  ];

  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '5rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 0.8fr 1.2fr', gap: '3rem', marginBottom: '4rem' }} className="footer-grid">
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Link href="/">
              <img
                src={logoUrl}
                alt={`${siteName} Logo`}
                style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
                onError={(e) => { e.target.src = '/logo.png'; }}
              />
            </Link>
            <p style={{ color: 'var(--text-light)', fontSize: '0.94rem', lineHeight: '1.6' }}>
              {description}
            </p>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              {socials.map((social, i) => {
                if (!social.url || social.url === '#') return null;
                return (
                  <a
                    key={i}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      transition: 'all var(--transition-fast)',
                    }}
                    className="social-hover-icon"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li><Link href="/" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.94rem' }} className="footer-link-item">Home</Link></li>
              <li><Link href="/about" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.94rem' }} className="footer-link-item">About Us</Link></li>
              <li><Link href="/services" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.94rem' }} className="footer-link-item">Services</Link></li>
              <li><Link href="/products" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.94rem' }} className="footer-link-item">Products</Link></li>
              <li><Link href="/portfolio" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.94rem' }} className="footer-link-item">Portfolio</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--text-light)', fontSize: '0.92rem' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                <span>{address}</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.92rem' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{phone}</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.92rem' }}>
                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{email}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '24px', color: 'var(--text-main)' }}>Newsletter</h4>
            <p style={{ color: 'var(--text-light)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: '1.5' }}>
              Subscribe to receive brief strategic technical insights.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', position: 'relative' }}>
              <input
                type="email"
                placeholder="name@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 50px 14px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '100px',
                  fontSize: '0.92rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
                aria-label="Subscribe"
              >
                <Send size={14} />
              </button>
            </form>
            {subscribed && (
              <p style={{ color: 'green', fontSize: '0.85rem', marginTop: '10px', fontWeight: 600 }}>
                ✓ Subscription successful! Thank you.
              </p>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
          }}
          className="footer-bottom-bar"
        >
          <p style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.88rem' }} className="footer-link-item">Privacy Policy</Link>
            <Link href="#" style={{ color: 'var(--text-light)', textDecoration: 'none', fontSize: '0.88rem' }} className="footer-link-item">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

