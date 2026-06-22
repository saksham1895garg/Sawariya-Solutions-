'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Cpu, Cloud, Shield, Code, Globe, TrendingUp, 
  Award, Briefcase, CheckCircle, Check, Star, Mail, Phone, MapPin, Send
} from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import ParticlesBg from '@/components/ParticlesBg';

const iconMap = {
  Cpu: Cpu,
  Cloud: Cloud,
  Shield: Shield,
  Code: Code,
  Globe: Globe,
  TrendingUp: TrendingUp,
  Award: Award,
  Briefcase: Briefcase,
  CheckCircle: CheckCircle,
};

export default function HomePage() {
  const [hero, setHero] = useState(null);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [settings, setSettings] = useState(null);
  
  // Testimonial state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({ name: '', email: '', company: '', service: '', message: '' });
  const [formStatus, setFormStatus] = useState({ type: '', text: '' });
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    // Parallel fetches for efficiency
    Promise.all([
      fetch('/api/hero').then(res => res.json()),
      fetch('/api/services').then(res => res.json()),
      fetch('/api/products').then(res => res.json()),
      fetch('/api/milestones').then(res => res.json()),
      fetch('/api/testimonials').then(res => res.json()),
      fetch('/api/blogs').then(res => res.json()),
      fetch('/api/settings').then(res => res.json()),
    ]).then(([heroData, servicesData, productsData, milestonesData, testimonialsData, blogsData, settingsData]) => {
      setHero(heroData);
      setServices(servicesData);
      setProducts(productsData);
      setMilestones(milestonesData);
      setTestimonials(testimonialsData);
      setBlogs(blogsData.slice(0, 3)); // show top 3
      setSettings(settingsData);
    }).catch(err => console.error('Error fetching home data:', err));
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoadingForm(true);
    setFormStatus({ type: '', text: '' });

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setFormStatus({ type: 'success', text: data.message });
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
      } else {
        setFormStatus({ type: 'error', text: data.message });
      }
    } catch (err) {
      setFormStatus({ type: 'error', text: 'Something went wrong. Please try again later.' });
    } finally {
      setLoadingForm(false);
    }
  };

  // Autoplay Testimonial Carousel
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (!hero || !settings) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,74,173,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Loading Sawariya Solutions...</p>
      </div>
    );
  }

  return (
    <>
      {/* HERO SECTION */}
      <section style={{ overflow: 'hidden', padding: '6rem 0 4rem', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <ParticlesBg />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid-2">
            {/* Hero Left Content */}
            <div>
              <AnimatedSection direction="right" duration={0.8}>
                <span className="pill-label">{hero.subtitle}</span>
                <h1 style={{ marginBottom: '1.5rem', lineHeight: '1.1' }}>
                  {hero.title.split(' ').map((word, idx) => {
                    const isAccent = idx >= hero.title.split(' ').length - 3; // accent the last 3 words
                    return (
                      <span key={idx} className={isAccent ? 'text-gradient' : ''} style={{ display: 'inline-block', marginRight: '10px' }}>
                        {word}
                      </span>
                    );
                  })}
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2.5rem', maxWidth: '540px', lineHeight: '1.6' }}>
                  {hero.description}
                </p>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                  <Link href={hero.primary_cta_link} className="btn btn-primary">
                    {hero.primary_cta_text}
                    <ArrowRight size={18} />
                  </Link>
                  <Link href={hero.secondary_cta_link} className="btn btn-secondary">
                    {hero.secondary_cta_text}
                  </Link>
                </div>
              </AnimatedSection>

              {/* Integrations Row */}
              <AnimatedSection direction="up" delay={0.3} style={{ marginTop: '4rem' }}>
                <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'var(--text-light)', marginBottom: '15px' }}>
                  Strategic Integrations & Certifications
                </p>
                <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Shield size={18} style={{ color: 'var(--primary)' }} />
                    <span>ISO 27001 Certified</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <Cloud size={18} style={{ color: 'var(--primary)' }} />
                    <span>AWS & GCP Partner</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: 600 }}>
                    <CheckCircle size={18} style={{ color: 'var(--primary)' }} />
                    <span>Vercel Enterprise Partner</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Hero Right Visuals */}
            <div style={{ position: 'relative' }}>
              <AnimatedSection direction="left" duration={0.8}>
                <div className="hero-img-container" style={{ boxShadow: '0 30px 60px -15px rgba(0, 74, 173, 0.15)', border: '1px solid var(--border)' }}>
                  <img 
                    src={hero.image_url} 
                    alt="Corporate Consulting Team" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0, 74, 173, 0.2), transparent)' }} />
                </div>

                {/* Floating Metric 1 */}
                <motion.div 
                  className="glass-panel"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '12%',
                    left: '-15%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(0, 74, 173, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--primary)' }} className="flex-center">
                    <Cloud size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>99.98%</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Cloud Uptime</div>
                  </div>
                </motion.div>

                {/* Floating Metric 2 */}
                <motion.div 
                  className="glass-panel"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '-10%',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--secondary)' }} className="flex-center">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>150+</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Enterprise Builds</div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER LOGOS */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '3rem 0', borderY: '1px solid var(--border)' }}>
        <div className="container">
          <AnimatedSection direction="fade">
            <p style={{ textAlign: 'center', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: 'var(--text-light)', marginBottom: '25px' }}>
              Trusted by Forward-Thinking Global Brands
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: '30px', flexWrap: 'wrap', opacity: 0.7 }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '1px' }}>APEX SYS</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '1px' }}>EQUINOX FIN</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '1px' }}>SPARK CREATIVE</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '1px' }}>VERTEX DATA</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-light)', letterSpacing: '1px' }}>CORE NEXUS</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CAPABILITIES / SERVICES */}
      <section id="services">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem' }}>
            <span className="pill-label">Capabilities</span>
            <h2>End-to-End Enterprise Services</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '15px' }}>
              We design, deploy, and manage advanced cloud environments and custom software solutions tailored for high performance.
            </p>
          </div>

          <div className="grid-3">
            {services.map((service, index) => {
              const IconComponent = iconMap[service.icon_name] || Cpu;
              return (
                <AnimatedSection key={service.id} direction="up" delay={index * 0.1}>
                  <div className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(0, 74, 173, 0.06)', border: '1px solid rgba(0, 74, 173, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      <IconComponent size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--text-main)' }}>{service.title}</h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.94rem', lineHeight: '1.6', flex: 1 }}>
                      {service.description}
                    </p>
                    <Link href="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '24px', textDecoration: 'none' }} className="service-link-hover">
                      Explore Architecture
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* METRICS & COUNTERS */}
      <section style={{ backgroundColor: 'var(--primary)', color: '#ffffff', padding: '5rem 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.1)', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid-4" style={{ textAlign: 'center' }}>
            {milestones.map((milestone, idx) => {
              const IconComponent = iconMap[milestone.icon_name] || CheckCircle;
              return (
                <AnimatedSection key={milestone.id} direction="scale" delay={idx * 0.1}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>
                      <IconComponent size={32} />
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'Outfit', lineHeight: 1 }}>
                      {milestone.number}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                      {milestone.label}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS SHOWCASE */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }} id="products">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 5rem' }}>
            <span className="pill-label">Innovations</span>
            <h2>Proprietary Software Systems</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '15px' }}>
              We design and license bespoke toolkits that speed up data flow and maximize operations metrics.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
            {products.map((product, index) => {
              const isEven = index % 2 === 0;
              return (
                <AnimatedSection key={product.id} direction={isEven ? 'right' : 'left'}>
                  <div style={{ display: 'grid', gridTemplateColumns: isEven ? '1fr 1fr' : '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="grid-2">
                    
                    {/* Visual */}
                    <div style={{ order: isEven ? 0 : 1, position: 'relative' }}>
                      <div className="product-img-container" style={{ boxShadow: '0 20px 40px rgba(0,74,173,0.08)', border: '1px solid var(--border)' }}>
                        <img 
                          src={product.image_url} 
                          alt={product.title} 
                        />
                      </div>
                      <div style={{ position: 'absolute', bottom: '-20px', right: isEven ? '-20px' : 'auto', left: isEven ? 'auto' : '-20px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', zIndex: -1 }} />
                    </div>

                    {/* Content */}
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '10px' }}>
                        {product.tag}
                      </span>
                      <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '15px', color: 'var(--text-main)' }}>{product.title}</h3>
                      <p style={{ color: 'var(--text-light)', marginBottom: '24px', lineHeight: '1.6' }}>
                        {product.description}
                      </p>
                      
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                        {product.benefits && product.benefits.map((benefit, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'rgba(0, 74, 173, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                              <Check size={12} />
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <Link href={product.cta_link} className="btn btn-primary">
                        {product.cta_text}
                        <ArrowRight size={16} />
                      </Link>
                    </div>

                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 4rem' }}>
            <span className="pill-label">Client Voices</span>
            <h2>Valued Partner Perspectives</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '15px' }}>
              Read how our enterprise solutions have enabled leading companies to achieve operations clarity.
            </p>
          </div>

          {testimonials.length > 0 && (
            <AnimatedSection direction="scale" className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', padding: '3.5rem', position: 'relative' }}>
              <Star size={64} style={{ position: 'absolute', top: '30px', right: '40px', color: 'rgba(0,74,173,0.03)', pointerEvents: 'none' }} />
              
              <div style={{ display: 'flex', gap: '5px', color: '#eab308', marginBottom: '20px' }}>
                {[...Array(testimonials[testimonialIndex].rating || 5)].map((_, i) => (
                  <Star key={i} size={18} fill="#eab308" />
                ))}
              </div>

              <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '30px', fontWeight: 500 }}>
                "{testimonials[testimonialIndex].feedback}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
                <img
                  src={testimonials[testimonialIndex].image_url}
                  alt={testimonials[testimonialIndex].name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{testimonials[testimonialIndex].name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {testimonials[testimonialIndex].role}, <span style={{ color: 'var(--primary)' }}>{testimonials[testimonialIndex].company}</span>
                  </p>
                </div>
              </div>

              {/* Slider Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '30px' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: i === testimonialIndex ? 'var(--primary)' : 'rgba(0, 74, 173, 0.15)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  />
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* FEATURED BLOGS / INSIGHTS */}
      <section style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <span className="pill-label">Insights</span>
              <h2>The Strategic Mindset</h2>
            </div>
            <Link href="/blogs" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }} className="service-link-hover">
              See All Articles
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-3">
            {blogs.map((blog, idx) => (
              <AnimatedSection key={blog.id} direction="up" delay={idx * 0.1}>
                <article className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)' }}>
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
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-main)', lineHeight: '1.3' }}>
                      <Link href={`/blogs/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }} className="blog-title-link">
                        {blog.title}
                      </Link>
                    </h3>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.92rem', lineHeight: '1.5', flex: 1 }}>
                      {blog.excerpt}
                    </p>
                    <Link href={`/blogs/${blog.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', marginTop: '20px', textDecoration: 'none' }} className="service-link-hover">
                      Read Article
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact">
        <div className="container">
          <div className="grid-2">
            
            {/* Contact Details */}
            <div>
              <span className="pill-label">Get in Touch</span>
              <h2>Let's Build Something Exceptional</h2>
              <p style={{ color: 'var(--text-light)', marginTop: '15px', marginBottom: '2.5rem', maxWidth: '500px' }}>
                Connect with our executive consulting team. We typically respond to scheduling requests within 2 business hours.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontWeight: 600 }}>Corporate HQ</div>
                    <div style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-main)' }}>{settings.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-panel" style={{ padding: '3rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-main)' }}>Consultation Intake Form</h3>
              
              <form onSubmit={handleFormSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
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
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
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
                      {services.map(s => (
                        <option key={s.id} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                  </div>
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
                  disabled={loadingForm}
                  className="btn btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                >
                  {loadingForm ? (
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <>
                      Submit Proposal Request
                      <Send size={16} />
                    </>
                  )}
                </button>

                {formStatus.text && (
                  <div 
                    style={{ 
                      marginTop: '20px', 
                      padding: '12px 18px', 
                      borderRadius: '8px', 
                      fontSize: '0.94rem', 
                      fontWeight: 600,
                      backgroundColor: formStatus.type === 'success' ? '#dcfce7' : '#fee2e2',
                      color: formStatus.type === 'success' ? '#166534' : '#991b1b',
                      border: `1px solid ${formStatus.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
                    }}
                  >
                    {formStatus.text}
                  </div>
                )}
              </form>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}

