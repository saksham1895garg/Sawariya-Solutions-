'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { clearCredentials } from '@/lib/store/authSlice';
import { 
  Shield, LogOut, LayoutGrid, Layers, ShoppingBag, FolderGit, 
  BookOpen, Briefcase, Star, MessageSquare, Settings, Upload, Plus, Trash2, Edit2, CheckCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  // Selected Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Database Data States
  const [hero, setHero] = useState({});
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [careers, setCareers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [messages, setMessages] = useState([]);
  const [applications, setApplications] = useState([]);
  const [settings, setSettings] = useState({});

  // Loading States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notify, setNotify] = useState({ type: '', message: '' });

  // Modal / Form States (for Create/Edit actions)
  const [editItem, setEditItem] = useState(null); // holds object being edited
  const [modalType, setModalType] = useState(''); // 'service', 'product', 'portfolio', 'blog', 'career', 'testimonial', 'milestone'

  // Standard fetcher using Bearer token
  const fetchWithAuth = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        heroRes, servicesRes, productsRes, portfolioRes, blogsRes, 
        careersRes, testimonialsRes, milestonesRes, messagesRes, 
        applicationsRes, settingsRes
      ] = await Promise.all([
        fetch('/api/hero').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/portfolio').then(r => r.json()),
        fetch('/api/blogs').then(r => r.json()),
        fetch('/api/careers').then(r => r.json()),
        fetch('/api/testimonials').then(r => r.json()),
        fetch('/api/milestones').then(r => r.json()),
        fetchWithAuth('/api/messages').then(r => r.json()),
        fetchWithAuth('/api/applications').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
      ]);

      setHero(heroRes);
      setServices(servicesRes);
      setProducts(productsRes);
      setPortfolio(portfolioRes);
      setBlogs(blogsRes);
      setCareers(careersRes);
      setTestimonials(testimonialsRes);
      setMilestones(milestonesRes);
      setMessages(messagesRes);
      setApplications(applicationsRes);
      setSettings(settingsRes);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
      showNotify('error', 'Error connecting to database APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const showNotify = (type, message) => {
    setNotify({ type, message });
    setTimeout(() => setNotify({ type: '', message: '' }), 5000);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch(clearCredentials());
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  // Image Upload helper
  const handleImageUpload = async (e, onUploadSuccess) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        onUploadSuccess(data.url);
        showNotify('success', 'Image uploaded successfully!');
      } else {
        showNotify('error', data.message || 'Image upload failed');
      }
    } catch (err) {
      showNotify('error', 'Upload request failed.');
    } finally {
      setSaving(false);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        showNotify('success', 'Website settings saved!');
      } else {
        showNotify('error', 'Failed to save settings.');
      }
    } catch (err) {
      showNotify('error', 'Database write error.');
    } finally {
      setSaving(false);
    }
  };

  // Save Hero
  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      });
      if (res.ok) {
        showNotify('success', 'Hero section updated!');
      } else {
        showNotify('error', 'Failed to update Hero.');
      }
    } catch (err) {
      showNotify('error', 'Database write error.');
    } finally {
      setSaving(false);
    }
  };

  // Generic Delete Helper
  const handleDeleteItem = async (endpoint, id, refreshList) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetchWithAuth(`${endpoint}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotify('success', 'Item deleted.');
        refreshList();
      } else {
        showNotify('error', 'Failed to delete item.');
      }
    } catch (err) {
      showNotify('error', 'Server error.');
    }
  };

  // Generic Save Modal Helper (Insert or Update)
  const handleModalSave = async (e, endpoint, payload, refreshList) => {
    e.preventDefault();
    setSaving(true);
    const isEdit = !!payload.id;
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `${endpoint}/${payload.id}` : endpoint;

    try {
      const res = await fetchWithAuth(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotify('success', isEdit ? 'Item updated successfully!' : 'Item created successfully!');
        setEditItem(null);
        refreshList();
      } else {
        const data = await res.json();
        showNotify('error', data.message || 'Action failed.');
      }
    } catch (err) {
      showNotify('error', 'Server connection error.');
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = (type) => {
    setModalType(type);
    let defaults = {};
    if (type === 'service') defaults = { title: '', description: '', icon_name: 'Cpu', sort_order: 0 };
    if (type === 'product') defaults = { tag: '', title: '', description: '', image_url: '', benefits: [], cta_text: 'Learn More', cta_link: '#', sort_order: 0 };
    if (type === 'portfolio') defaults = { category: '', title: '', client: '', description: '', image_url: '', link: '#', sort_order: 0 };
    if (type === 'blog') defaults = { category: '', title: '', excerpt: '', content: '', image_url: '', author: 'Yashwardhan Sharma', date: new Date().toISOString().split('T')[0] };
    if (type === 'career') defaults = { title: '', department: '', location: '', type: 'Full-Time', description: '', requirements: [] };
    if (type === 'testimonial') defaults = { name: '', role: '', company: '', feedback: '', image_url: '', rating: 5, sort_order: 0 };
    if (type === 'milestone') defaults = { number: '', label: '', icon_name: 'CheckCircle', sort_order: 0 };
    setEditItem(defaults);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,74,173,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-light)', fontWeight: 600 }}>Loading admin console...</p>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutGrid },
    { id: 'hero', name: 'Hero Banner', icon: Layers },
    { id: 'services', name: 'Services', icon: Shield },
    { id: 'products', name: 'Products', icon: ShoppingBag },
    { id: 'portfolio', name: 'Portfolio', icon: FolderGit },
    { id: 'blogs', name: 'Blogs', icon: BookOpen },
    { id: 'careers', name: 'Careers', icon: Briefcase },
    { id: 'testimonials', name: 'Testimonials', icon: Star },
    { id: 'messages', name: 'Inbox Messages', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      {/* Sidebar Panel */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 24px', marginBottom: '2.5rem' }}>
          <Shield size={24} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>Sawariya Admin</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: isSelected ? 'rgba(0, 74, 173, 0.06)' : 'transparent',
                  color: isSelected ? 'var(--primary)' : 'var(--text-light)',
                  fontWeight: 600,
                  fontSize: '0.94rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                className="admin-nav-btn"
              >
                <Icon size={18} />
                <span>{item.name}</span>
                {item.id === 'messages' && messages.length > 0 && (
                  <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: '#ffffff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '50px', fontWeight: 700 }}>
                    {messages.length}
                  </span>
                )}
                {item.id === 'careers' && applications.length > 0 && (
                  <span style={{ marginLeft: 'auto', backgroundColor: 'var(--secondary)', color: '#ffffff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '50px', fontWeight: 700 }}>
                    {applications.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '0 12px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', marginBottom: '15px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user?.username}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
              fontWeight: 600,
              fontSize: '0.94rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        
        {/* Toast Notification */}
        {notify.message && (
          <div 
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 300,
              padding: '14px 20px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.94rem',
              backgroundColor: notify.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: notify.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${notify.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            }}
          >
            {notify.message}
          </div>
        )}

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Welcome back, manage website data fields.</p>
          </div>
        </header>

        {/* ============================================================== */}
        {/* TAB CONTENTS                                                   */}
        {/* ============================================================== */}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '2.5rem' }} className="grid-3">
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Inbox Queries</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--primary)' }}>{messages.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Job Applications</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '8px', color: 'var(--secondary)' }}>{applications.length}</div>
              </div>
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Services Managed</div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '8px' }}>{services.length}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }} className="grid-2">
              <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Recent Messages</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>{msg.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{new Date(msg.date).toLocaleDateString()}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>Interest: {msg.service}</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '5px' }}>"{msg.message}"</p>
                    </div>
                  ))}
                  {messages.length === 0 && <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>No recent messages.</p>}
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Quick Stats</h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.94rem' }}>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Blogs Published</span><strong>{blogs.length}</strong></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Job Openings</span><strong>{careers.length}</strong></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Portfolio Projects</span><strong>{portfolio.length}</strong></li>
                  <li style={{ display: 'flex', justifyContent: 'space-between' }}><span>Client Testimonials</span><strong>{testimonials.length}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. HERO TAB */}
        {activeTab === 'hero' && (
          <form onSubmit={handleSaveHero} className="glass-panel" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Hero Section Settings</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="heroSubtitle">Hero Subtitle</label>
              <input
                type="text"
                id="heroSubtitle"
                value={hero.subtitle || ''}
                onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="heroTitle">Hero Title</label>
              <input
                type="text"
                id="heroTitle"
                value={hero.title || ''}
                onChange={(e) => setHero({ ...hero, title: e.target.value })}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="heroDesc">Hero Description</label>
              <textarea
                id="heroDesc"
                value={hero.description || ''}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                className="form-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="heroCtaText">Primary CTA Text</label>
                <input
                  type="text"
                  id="heroCtaText"
                  value={hero.primary_cta_text || ''}
                  onChange={(e) => setHero({ ...hero, primary_cta_text: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="heroCtaLink">Primary CTA Link</label>
                <input
                  type="text"
                  id="heroCtaLink"
                  value={hero.primary_cta_link || ''}
                  onChange={(e) => setHero({ ...hero, primary_cta_link: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="heroCtaSecText">Secondary CTA Text</label>
                <input
                  type="text"
                  id="heroCtaSecText"
                  value={hero.secondary_cta_text || ''}
                  onChange={(e) => setHero({ ...hero, secondary_cta_text: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="heroCtaSecLink">Secondary CTA Link</label>
                <input
                  type="text"
                  id="heroCtaSecLink"
                  value={hero.secondary_cta_link || ''}
                  onChange={(e) => setHero({ ...hero, secondary_cta_link: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hero Background/Team Image</label>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={hero.image_url || ''}
                  onChange={(e) => setHero({ ...hero, image_url: e.target.value })}
                  className="form-control"
                  style={{ flex: 1 }}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 18px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, (url) => setHero({ ...hero, image_url: url }))}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              {hero.image_url && (
                <img 
                  src={hero.image_url} 
                  alt="Preview" 
                  style={{ height: '100px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px', border: '1px solid var(--border)' }} 
                />
              )}
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '20px' }}>
              {saving ? 'Saving...' : 'Save Hero Changes'}
            </button>
          </form>
        )}

        {/* 3. SERVICES TAB */}
        {activeTab === 'services' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Website Services Capabilities</h3>
              <button onClick={() => openAddModal('service')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Service
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Icon</th>
                    <th style={{ padding: '16px' }}>Title</th>
                    <th style={{ padding: '16px' }}>Description Excerpt</th>
                    <th style={{ padding: '16px' }}>Sort Order</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.icon_name}</td>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.title}</td>
                      <td style={{ padding: '16px', color: 'var(--text-light)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </td>
                      <td style={{ padding: '16px' }}>{item.sort_order}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('service'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/services', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Products Showcase</h3>
              <button onClick={() => openAddModal('product')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Preview</th>
                    <th style={{ padding: '16px' }}>Tag</th>
                    <th style={{ padding: '16px' }}>Title</th>
                    <th style={{ padding: '16px' }}>Description</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px' }}>
                        <img src={item.image_url} alt="" style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.tag}</td>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.title}</td>
                      <td style={{ padding: '16px', color: 'var(--text-light)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('product'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/products', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Portfolio Case Studies</h3>
              <button onClick={() => openAddModal('portfolio')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Project
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Mockup</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Project Title</th>
                    <th style={{ padding: '16px' }}>Client</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px' }}>
                        <img src={item.image_url} alt="" style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.category}</td>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.title}</td>
                      <td style={{ padding: '16px', color: 'var(--text-light)' }}>{item.client}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('portfolio'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/portfolio', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. BLOGS TAB */}
        {activeTab === 'blogs' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Blog Articles</h3>
              <button onClick={() => openAddModal('blog')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Article
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Title</th>
                    <th style={{ padding: '16px' }}>Category</th>
                    <th style={{ padding: '16px' }}>Author</th>
                    <th style={{ padding: '16px' }}>Publish Date</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.title}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.category}</td>
                      <td style={{ padding: '16px', color: 'var(--text-light)' }}>{item.author}</td>
                      <td style={{ padding: '16px' }}>{new Date(item.date).toLocaleDateString()}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('blog'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/blogs', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. CAREERS TAB */}
        {activeTab === 'careers' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Active Job Openings</h3>
              <button onClick={() => openAddModal('career')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Job Opening
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden', marginBottom: '3rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Position Title</th>
                    <th style={{ padding: '16px' }}>Department</th>
                    <th style={{ padding: '16px' }}>Location</th>
                    <th style={{ padding: '16px' }}>Type</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {careers.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.title}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.department}</td>
                      <td style={{ padding: '16px', color: 'var(--text-light)' }}>{item.location}</td>
                      <td style={{ padding: '16px' }}>{item.type}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('career'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/careers', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Candidate Applications Received</h3>
            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Candidate Name</th>
                    <th style={{ padding: '16px' }}>Email / Phone</th>
                    <th style={{ padding: '16px' }}>Applied Position</th>
                    <th style={{ padding: '16px' }}>Resume URL</th>
                    <th style={{ padding: '16px' }}>Message</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '16px' }}>
                        <div>{item.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{item.phone}</div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>{item.job_title}</td>
                      <td style={{ padding: '16px' }}>
                        <a href={item.resume_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontWeight: 600 }}>View Resume</a>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.message}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteItem('/api/applications', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>No applications received yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Client Testimonials</h3>
              <button onClick={() => openAddModal('testimonial')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Testimonial
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden', marginBottom: '3rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Avatar</th>
                    <th style={{ padding: '16px' }}>Client Name</th>
                    <th style={{ padding: '16px' }}>Role / Company</th>
                    <th style={{ padding: '16px' }}>Feedback Quote</th>
                    <th style={{ padding: '16px' }}>Rating</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {testimonials.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px' }}>
                        <img src={item.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      </td>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '16px' }}>
                        <div>{item.role}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>{item.company}</div>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--text-light)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        "{item.feedback}"
                      </td>
                      <td style={{ padding: '16px', color: '#eab308', fontWeight: 700 }}>★ {item.rating}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('testimonial'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/testimonials', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Milestones / Counters</h3>
              <button onClick={() => openAddModal('milestone')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
                <Plus size={16} /> Add Milestone
              </button>
            </div>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Number Metric</th>
                    <th style={{ padding: '16px' }}>Display Label</th>
                    <th style={{ padding: '16px' }}>Vector Icon</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>{item.number}</td>
                      <td style={{ padding: '16px', fontWeight: 600 }}>{item.label}</td>
                      <td style={{ padding: '16px' }}>{item.icon_name}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setModalType('milestone'); setEditItem(item); }} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteItem('/api/milestones', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Contact Form Query Inbox</h3>

            <div className="glass-panel" style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.94rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '16px' }}>Sender Name</th>
                    <th style={{ padding: '16px' }}>Email / Company</th>
                    <th style={{ padding: '16px' }}>Service Requested</th>
                    <th style={{ padding: '16px' }}>Message Body</th>
                    <th style={{ padding: '16px' }}>Received Date</th>
                    <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px', fontWeight: 700 }}>{item.name}</td>
                      <td style={{ padding: '16px' }}>
                        <div>{item.email}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{item.company}</div>
                      </td>
                      <td style={{ padding: '16px', fontWeight: 600, color: 'var(--primary)' }}>{item.service}</td>
                      <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '300px', whiteSpace: 'pre-line' }}>{item.message}</td>
                      <td style={{ padding: '16px' }}>{new Date(item.date).toLocaleString()}</td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteItem('/api/messages', item.id, loadData)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-light)' }}>Your Inbox is empty!</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 10. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="glass-panel" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Website Global Settings</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="siteName">Site Name</label>
                <input
                  type="text"
                  id="siteName"
                  value={settings.site_name || ''}
                  onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Company Logo (ImageKit / Fallback)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={settings.logo_url || ''}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    className="form-control"
                    style={{ flex: 1 }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <Upload size={14} /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setSettings({ ...settings, logo_url: url }))}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="metaTitle">SEO Meta Title</label>
                <input
                  type="text"
                  id="metaTitle"
                  value={settings.meta_title || ''}
                  onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="metaKeywords">SEO Meta Keywords</label>
                <input
                  type="text"
                  id="metaKeywords"
                  value={settings.meta_keywords || ''}
                  onChange={(e) => setSettings({ ...settings, meta_keywords: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="metaDesc">SEO Meta Description</label>
              <textarea
                id="metaDesc"
                value={settings.meta_description || ''}
                onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                className="form-control"
              />
            </div>

            <h4 style={{ fontSize: '1.05rem', margin: '20px 0 10px', color: 'var(--text-main)' }}>Contact details</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="hours">Hours of Operation</label>
                <input
                  type="text"
                  id="hours"
                  value={settings.hours || ''}
                  onChange={(e) => setSettings({ ...settings, hours: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mapUrl">Google Maps Embed Source Link</label>
              <textarea
                id="mapUrl"
                value={settings.map_url || ''}
                onChange={(e) => setSettings({ ...settings, map_url: e.target.value })}
                className="form-control"
              />
            </div>

            <h4 style={{ fontSize: '1.05rem', margin: '20px 0 10px', color: 'var(--text-main)' }}>Social links</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="facebook">Facebook Link</label>
                <input
                  type="text"
                  id="facebook"
                  value={settings.facebook_url || ''}
                  onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="instagram">Instagram Link</label>
                <input
                  type="text"
                  id="instagram"
                  value={settings.instagram_url || ''}
                  onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="linkedin">LinkedIn Link</label>
                <input
                  type="text"
                  id="linkedin"
                  value={settings.linkedin_url || ''}
                  onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="whatsapp">WhatsApp Number (e.g. +918000551065)</label>
                <input
                  type="text"
                  id="whatsapp"
                  value={settings.whatsapp_num || ''}
                  onChange={(e) => setSettings({ ...settings, whatsapp_num: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: '20px' }}>
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* MODAL POPUPS FOR CREATE/EDIT                                   */}
        {/* ============================================================== */}
        {editItem && (
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(0,0,0,0.4)', 
              backdropFilter: 'blur(8px)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 250, 
              padding: '20px' 
            }}
          >
            <div 
              className="glass-panel" 
              style={{ 
                width: '100%', 
                maxWidth: '600px', 
                padding: '2.5rem', 
                backgroundColor: '#ffffff', 
                maxHeight: '90vh', 
                overflowY: 'auto' 
              }}
            >
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                {editItem.id ? 'Edit Item' : 'Add New Item'} ({modalType.toUpperCase()})
              </h3>

              {/* SERVICE FORM */}
              {modalType === 'service' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/services', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Service Title</label>
                    <input required type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea required value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lucide Icon (e.g. Cpu, Cloud, Shield, Code, Globe, TrendingUp)</label>
                    <input type="text" value={editItem.icon_name || ''} onChange={(e) => setEditItem({ ...editItem, icon_name: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} className="form-control" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* PRODUCT FORM */}
              {modalType === 'product' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/products', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Product Tag (e.g. Platform, Data Layer)</label>
                    <input type="text" value={editItem.tag || ''} onChange={(e) => setEditItem({ ...editItem, tag: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input required type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Benefits (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Benefit 1, Benefit 2, Benefit 3"
                      value={Array.isArray(editItem.benefits) ? editItem.benefits.join(', ') : ''}
                      onChange={(e) => setEditItem({ ...editItem, benefits: e.target.value.split(',').map(b => b.trim()).filter(b => b) })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Product Screenshot/Image URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={editItem.image_url || ''} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} className="form-control" style={{ flex: 1 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <Upload size={14} /> Upload
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditItem({ ...editItem, image_url: url }))} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label">CTA Text</label>
                      <input type="text" value={editItem.cta_text || ''} onChange={(e) => setEditItem({ ...editItem, cta_text: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CTA Link</label>
                      <input type="text" value={editItem.cta_link || ''} onChange={(e) => setEditItem({ ...editItem, cta_link: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} className="form-control" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* PORTFOLIO FORM */}
              {modalType === 'portfolio' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/portfolio', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Project Category (e.g. Cloud Migration, FinTech)</label>
                    <input type="text" value={editItem.category || ''} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input required type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input type="text" value={editItem.client || ''} onChange={(e) => setEditItem({ ...editItem, client: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Screenshot URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={editItem.image_url || ''} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} className="form-control" style={{ flex: 1 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <Upload size={14} /> Upload
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditItem({ ...editItem, image_url: url }))} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Case Study Link</label>
                    <input type="text" value={editItem.link || ''} onChange={(e) => setEditItem({ ...editItem, link: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} className="form-control" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* BLOG FORM */}
              {modalType === 'blog' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/blogs', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <input type="text" value={editItem.category || ''} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input required type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Brief Excerpt</label>
                    <input type="text" value={editItem.excerpt || ''} onChange={(e) => setEditItem({ ...editItem, excerpt: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Author Name</label>
                    <input type="text" value={editItem.author || ''} onChange={(e) => setEditItem({ ...editItem, author: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Publish Date</label>
                    <input type="date" value={editItem.date ? new Date(editItem.date).toISOString().split('T')[0] : ''} onChange={(e) => setEditItem({ ...editItem, date: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Featured Image URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={editItem.image_url || ''} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} className="form-control" style={{ flex: 1 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <Upload size={14} /> Upload
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditItem({ ...editItem, image_url: url }))} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Article Content (Markdown/Text)</label>
                    <textarea required value={editItem.content || ''} onChange={(e) => setEditItem({ ...editItem, content: e.target.value })} className="form-control" style={{ minHeight: '200px' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* CAREER FORM */}
              {modalType === 'career' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/careers', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Job Title</label>
                    <input required type="text" value={editItem.title || ''} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} className="form-control" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }} className="grid-3">
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <input type="text" value={editItem.department || ''} onChange={(e) => setEditItem({ ...editItem, department: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input type="text" value={editItem.location || ''} onChange={(e) => setEditItem({ ...editItem, location: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select value={editItem.type || 'Full-Time'} onChange={(e) => setEditItem({ ...editItem, type: e.target.value })} className="form-control">
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role Description</label>
                    <textarea required value={editItem.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job Requirements (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Requirement 1, Requirement 2, Requirement 3"
                      value={Array.isArray(editItem.requirements) ? editItem.requirements.join(', ') : ''}
                      onChange={(e) => setEditItem({ ...editItem, requirements: e.target.value.split(',').map(r => r.trim()).filter(r => r) })}
                      className="form-control"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* TESTIMONIAL FORM */}
              {modalType === 'testimonial' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/testimonials', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input required type="text" value={editItem.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} className="form-control" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Role</label>
                      <input type="text" value={editItem.role || ''} onChange={(e) => setEditItem({ ...editItem, role: e.target.value })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" value={editItem.company || ''} onChange={(e) => setEditItem({ ...editItem, company: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Feedback Quote</label>
                    <textarea required value={editItem.feedback || ''} onChange={(e) => setEditItem({ ...editItem, feedback: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Headshot Image URL</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={editItem.image_url || ''} onChange={(e) => setEditItem({ ...editItem, image_url: e.target.value })} className="form-control" style={{ flex: 1 }} />
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                        <Upload size={14} /> Upload
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setEditItem({ ...editItem, image_url: url }))} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Rating Star (1-5)</label>
                      <input type="number" min="1" max="5" value={editItem.rating || 5} onChange={(e) => setEditItem({ ...editItem, rating: parseInt(e.target.value) })} className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Sort Order</label>
                      <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} className="form-control" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

              {/* MILESTONE FORM */}
              {modalType === 'milestone' && (
                <form onSubmit={(e) => handleModalSave(e, '/api/milestones', editItem, loadData)}>
                  <div className="form-group">
                    <label className="form-label">Metric Counter Number (e.g. 480+, 12+ Yrs)</label>
                    <input required type="text" value={editItem.number || ''} onChange={(e) => setEditItem({ ...editItem, number: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Display Label</label>
                    <input required type="text" value={editItem.label || ''} onChange={(e) => setEditItem({ ...editItem, label: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lucide Icon Name (e.g. CheckCircle, Briefcase, Award, TrendingUp)</label>
                    <input type="text" value={editItem.icon_name || ''} onChange={(e) => setEditItem({ ...editItem, icon_name: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sort Order</label>
                    <input type="number" value={editItem.sort_order ?? 0} onChange={(e) => setEditItem({ ...editItem, sort_order: parseInt(e.target.value) })} className="form-control" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button type="button" onClick={() => setEditItem(null)} className="btn btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Save</button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </main>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .admin-nav-btn:hover {
          background-color: rgba(0, 74, 173, 0.03) !important;
          color: var(--primary) !important;
        }
        table th {
          font-weight: 700;
          color: var(--text-muted);
        }
        table tr:hover {
          background-color: #fcfdfe;
        }
      `}</style>
    </div>
  );
}
