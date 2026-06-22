'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, Cloud, Shield, Code, Globe, TrendingUp, ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

const iconMap = {
  Cpu,
  Cloud,
  Shield,
  Code,
  Globe,
  TrendingUp,
};

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error('Error fetching services:', err));
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Header Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">Capabilities</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              Bespoke <span className="text-gradient">Enterprise Services</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              We partner with global firms to plan, engineer, scale, and secure high-performance system architectures.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '2.5rem' }}>
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon_name] || Cpu;
              return (
                <AnimatedSection key={service.id} direction="up" delay={index * 0.08}>
                  <div 
                    className="premium-card" 
                    style={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: '3rem 2.5rem',
                    }}
                  >
                    <div 
                      style={{ 
                        width: '56px', 
                        height: '56px', 
                        borderRadius: '16px', 
                        backgroundColor: 'rgba(0, 74, 173, 0.06)', 
                        border: '1px solid rgba(0, 74, 173, 0.1)', 
                        color: 'var(--primary)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        marginBottom: '24px',
                      }}
                    >
                      <IconComponent size={26} />
                    </div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '14px', color: 'var(--text-main)' }}>
                      {service.title}
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.96rem', lineHeight: '1.7', flex: 1 }}>
                      {service.description}
                    </p>
                    <Link 
                      href="/contact" 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--primary)', 
                        fontWeight: 700, 
                        fontSize: '0.9rem', 
                        marginTop: '28px', 
                        textDecoration: 'none',
                      }} 
                      className="service-link-hover"
                    >
                      Secure Consultation
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <AnimatedSection direction="scale">
            <h2 style={{ marginBottom: '20px' }}>Need a Bespoke Solution Architecture?</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '35px', fontSize: '1.1rem' }}>
              Connect directly with our Chief Architect to define your scaling strategy and request tech stack audits.
            </p>
            <Link href="/contact" className="btn btn-primary">
              Book Architecture Strategy Call
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
