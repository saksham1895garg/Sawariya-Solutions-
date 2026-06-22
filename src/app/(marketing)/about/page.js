'use client';

import { motion } from 'framer-motion';
import { Award, Shield, Target, Users, Code, Zap } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function AboutPage() {
  const values = [
    { icon: Award, title: 'Engineering Excellence', desc: 'We do not build simple placeholders. We build modular, highly structured systems designed for long-term scalability.' },
    { icon: Shield, title: 'Zero-Trust Safety', desc: 'Security is not an afterthought. Every database connection, access key, and API router is protected by zero-knowledge frameworks.' },
    { icon: Target, title: 'Strategic Milestones', desc: 'We align tech solutions with measurable ROI. Every feature we ship corresponds to concrete business growth.' },
    { icon: Users, title: 'Collaborative Consulting', desc: 'We operate as executive partners, directly auditing technology landscapes to save development cycles.' }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Hero Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">About Our Firm</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              Driving Transformative <span className="text-gradient">Business Value</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              Founded on the principle of engineering excellence, Sawariya Solution partners with enterprise-scale companies to navigate digital complexity. We turn ambiguous strategies into secure, highly-scalable software ecosystems.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder Profile / Mission */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '4rem' }}>
            {/* Visual */}
            <AnimatedSection direction="right">
              <div className="about-img-container" style={{ border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,74,173,0.06)' }}>
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                  alt="Senior Engineers in Meeting Room"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </AnimatedSection>

            {/* Quote and History */}
            <div>
              <AnimatedSection direction="left">
                <span className="pill-label" style={{ backgroundColor: 'rgba(59,130,246,0.05)', color: 'var(--secondary)' }}>Our Philosophy</span>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: 'var(--text-main)' }}>Structural Bedrocks of Digital Trust</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
                  Our global team of senior engineers and strategic consultants design robust architectures that modernize legacy systems, simplify data operations, and streamline customer journeys.
                </p>
                <div 
                  style={{ 
                    padding: '24px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: 'var(--radius-md)', 
                    borderLeft: '4px solid var(--primary)', 
                    boxShadow: '0 8px 24px rgba(0,74,173,0.04)',
                    marginBottom: '20px'
                  }}
                >
                  <p style={{ fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 500, marginBottom: '15px' }}>
                    "Premium design and clean code aren't optional additions—they form the structural bedrock of modern business trust."
                  </p>
                  <h4 style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.98rem' }}>Yashwardhan Sharma</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Founder & Chief Architect</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 4rem' }}>
            <span className="pill-label">Values</span>
            <h2>How We Drive Engagement</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '10px' }}>
              We implement solutions that guarantee performance metrics and reduce legacy bottlenecks.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '2rem' }}>
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <AnimatedSection key={i} direction="up" delay={i * 0.1}>
                  <div className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '20px', height: '100%' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(0, 74, 173, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-main)' }}>{v.title}</h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.94rem', lineHeight: '1.6' }}>{v.desc}</p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
