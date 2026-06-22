'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, Folder } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function BlogPostPage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load blog post:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,74,173,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>Article Not Found</h2>
        <p style={{ color: 'var(--text-light)', margin: '20px 0 30px' }}>The blog post you are looking for does not exist or has been removed.</p>
        <Link href="/blogs" className="btn btn-primary">
          <ArrowLeft size={16} />
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <article style={{ position: 'relative', overflow: 'hidden', paddingBottom: '6rem' }}>
      <ParticlesBg />

      {/* Hero Banner with Header */}
      <section style={{ padding: '4rem 0 2rem', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <Link href="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700, fontSize: '0.94rem', marginBottom: '2rem' }}>
              <ArrowLeft size={16} />
              Back to Insights
            </Link>

            <span className="pill-label">{blog.category}</span>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', lineHeight: '1.2' }}>{blog.title}</h1>
            
            {/* Meta Tags */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.94rem', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} style={{ color: 'var(--primary)' }} />
                <span>Written by: {blog.author}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} style={{ color: 'var(--primary)' }} />
                <span>
                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Image */}
      {blog.image_url && (
        <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 10, marginBottom: '3.5rem' }}>
          <AnimatedSection direction="scale">
            <div className="blog-img-container" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,74,173,0.06)' }}>
              <img 
                src={blog.image_url} 
                alt={blog.title} 
              />
            </div>
          </AnimatedSection>
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ maxWidth: '800px', position: 'relative', zIndex: 10 }}>
        <AnimatedSection direction="up">
          <div 
            style={{ 
              fontSize: '1.1rem', 
              lineHeight: '1.8', 
              color: 'var(--text-muted)',
              whiteSpace: 'pre-line', // respect paragraphs
            }}
          >
            {blog.content}
          </div>
        </AnimatedSection>
      </div>
    </article>
  );
}
