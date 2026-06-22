import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MarketingLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, minHeight: '80vh', paddingTop: '85px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
