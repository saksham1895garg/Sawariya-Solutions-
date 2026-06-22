'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    // Fetch website settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error('Failed to load settings in Navbar:', err));

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Careers', path: '/careers' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const logoUrl = settings?.logo_url || '/logo.png';
  const siteName = settings?.site_name || 'Sawariya Solution';
  const phoneNum = settings?.phone || '+91 80005 51065';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 100 + '%',
          height: scrolled ? '70px' : '85px',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0, 74, 173, 0.08)' : 'none',
          boxShadow: scrolled ? '0 10px 30px -10px rgba(0, 74, 173, 0.05)' : 'none',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img
              src={logoUrl}
              alt={`${siteName} Logo`}
              style={{
                height: scrolled ? '38px' : '45px',
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.4s ease',
              }}
              onError={(e) => {
                e.target.src = '/logo.png';
              }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="hidden-mobile">
            <ul style={{ display: 'flex', listStyle: 'none', gap: '28px', alignItems: 'center' }}>
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      style={{
                        fontSize: '0.96rem',
                        fontWeight: 600,
                        color: isActive ? 'var(--primary)' : 'var(--text-light)',
                        textDecoration: 'none',
                        position: 'relative',
                        padding: '6px 0',
                        transition: 'color var(--transition-fast)',
                      }}
                      className="nav-item-link"
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavIndicator"
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '2px',
                            backgroundColor: 'var(--primary)',
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/contact"
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                fontSize: '0.9rem',
                borderRadius: '50px',
              }}
            >
              Let's Talk
              <ArrowRight size={16} />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              zIndex: 150,
            }}
            className="show-mobile"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              height: '100vh',
              backgroundColor: '#ffffff',
              zIndex: 110,
              display: 'flex',
              flexDirection: 'column',
              padding: '100px 30px 40px',
            }}
          >
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                listStyle: 'none',
                gap: '24px',
                marginBottom: '40px',
              }}
            >
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      style={{
                        fontSize: '1.6rem',
                        fontWeight: 700,
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        textDecoration: 'none',
                        display: 'block',
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)', marginBottom: '20px' }}>
                <Phone size={18} />
                <span style={{ fontWeight: 600 }}>{phoneNum}</span>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Book Strategy Call
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

