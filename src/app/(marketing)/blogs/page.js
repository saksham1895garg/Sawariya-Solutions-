'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((err) => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Header Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">Insights & News</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              The Strategic <span className="text-gradient">Tech Mindset</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              Read articles written by our Senior Technical Consulting and Engineering teams regarding cloud, database architectures, automation, and security.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Blogs Grid */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div className="grid-3" style={{ gap: '2.5rem' }}>
            {blogs.map((blog, idx) => (
              <AnimatedSection key={blog.id} direction="up" delay={idx * 0.08}>
                <article 
                  className="glass-panel" 
                  style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div className="blog-img-container">
                    <img 
                      src={blog.image_url} 
                      alt={blog.title} 
                      style={{ transition: 'transform 0.5s ease' }} 
                      className="blog-card-img"
                    />
                  </div>
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '10px' }}>
                      <span>{blog.category}</span>
                      <span>•</span>
                      <time style={{ color: 'var(--text-light)' }}>
                        {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)', lineHeight: '1.3' }}>
                      <Link href={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="blog-title-link">
                        {blog.title}
                      </Link>
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.92rem', lineHeight: '1.5', flex: 1 }}>
                      {blog.excerpt}
                    </p>
                    <Link 
                      href={`/blogs/${blog.id}`} 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        color: 'var(--primary)', 
                        fontWeight: 700, 
                        fontSize: '0.88rem', 
                        marginTop: '24px', 
                        textDecoration: 'none',
                      }} 
                      className="service-link-hover"
                    >
                      Read Full Article
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>

          {blogs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-light)', fontWeight: 600 }}>
              No articles found. Check back later!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
