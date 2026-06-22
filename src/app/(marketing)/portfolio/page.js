'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        const uniqueCategories = ['All', ...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error('Error fetching portfolio:', err));
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter((p) => p.category === filter);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Header Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">Case Studies</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              Our Completed <span className="text-gradient">Builds & Projects</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              Explore how we have engineered systems, synchronized databases, and migrated complex infrastructures for global clients.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Projects Grid */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          
          {/* Category Filter buttons */}
          {categories.length > 2 && (
            <AnimatedSection direction="fade" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '3rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '50px',
                    border: '1px solid var(--border)',
                    backgroundColor: filter === cat ? 'var(--primary)' : '#ffffff',
                    color: filter === cat ? '#ffffff' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    fontSize: '0.92rem',
                    boxShadow: filter === cat ? '0 4px 15px rgba(0,74,173,0.2)' : 'none',
                  }}
                  className="filter-btn-hover"
                >
                  {cat}
                </button>
              ))}
            </AnimatedSection>
          )}

          {/* Grid list */}
          <div className="grid-2" style={{ gap: '2.5rem' }}>
            {filteredProjects.map((project, index) => (
              <AnimatedSection key={project.id} direction="up" delay={index * 0.08}>
                <div 
                  className="glass-panel" 
                  style={{ 
                    overflow: 'hidden', 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="portfolio-img-container">
                    <img 
                      src={project.image_url} 
                      alt={project.title} 
                      style={{ transition: 'transform 0.5s ease' }} 
                      className="portfolio-img"
                    />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '6px 12px', borderRadius: '50px', backgroundColor: 'rgba(255,255,255,0.95)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                      {project.category}
                    </div>
                  </div>

                  <div style={{ padding: '2.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
                      Client: {project.client}
                    </span>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>
                      {project.title}
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.94rem', lineHeight: '1.6', flex: 1 }}>
                      {project.description}
                    </p>
                    
                    {project.link && project.link !== '#' && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          color: 'var(--primary)', 
                          fontWeight: 700, 
                          fontSize: '0.9rem', 
                          marginTop: '24px', 
                          textDecoration: 'none',
                        }} 
                        className="service-link-hover"
                      >
                        Visit Project
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)', fontWeight: 600 }}>
              No portfolio projects found.
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .portfolio-img:hover {
          transform: scale(1.03);
        }
        .filter-btn-hover:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
      `}</style>
    </div>
  );
}
