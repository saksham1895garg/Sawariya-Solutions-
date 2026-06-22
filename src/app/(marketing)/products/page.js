'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <ParticlesBg />

      {/* Header Banner */}
      <section style={{ padding: '5rem 0 3rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <AnimatedSection direction="down">
            <span className="pill-label">Innovations</span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '20px' }}>
              Proprietary <span className="text-gradient">Software Systems</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', lineHeight: '1.6' }}>
              High-fidelity enterprise utilities designed to streamline workflows, sync data clusters, and simplify backend administration.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Products list */}
      <section style={{ position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            {products.map((product, index) => {
              const isEven = index % 2 === 0;
              return (
                <AnimatedSection key={product.id} direction={isEven ? 'right' : 'left'}>
                  <div className="grid-2" style={{ gap: '4rem', alignItems: 'center' }}>
                    
                    {/* Visual */}
                    <div style={{ order: isEven ? 0 : 1 }}>
                      <div className="product-img-container" style={{ border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,74,173,0.06)' }}>
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <span className="pill-label" style={{ backgroundColor: 'rgba(59,130,246,0.05)', color: 'var(--secondary)' }}>
                        {product.tag}
                      </span>
                      <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--text-main)' }}>
                        {product.title}
                      </h2>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '1.05rem', lineHeight: '1.7' }}>
                        {product.description}
                      </p>
                      
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '35px' }}>
                        {product.benefits && product.benefits.map((benefit, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0, 74, 173, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                              <Check size={12} />
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={product.cta_link} className="btn btn-primary">
                        {product.cta_text}
                        <ArrowRight size={18} />
                      </Link>
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
