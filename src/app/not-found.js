import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '70vh',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '6rem',
          fontWeight: 900,
          fontFamily: 'Outfit, sans-serif',
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}
      >
        404
      </div>

      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          color: 'var(--text-main)',
        }}
      >
        Page Not Found
      </h2>

      <p
        style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          maxWidth: '480px',
          lineHeight: '1.6',
        }}
      >
        The page you're looking for doesn't exist or has been moved. Let us help
        you find your way back.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <Link
          href="/"
          className="btn btn-primary"
          style={{ padding: '12px 28px', textDecoration: 'none' }}
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="btn btn-secondary"
          style={{ padding: '12px 28px', textDecoration: 'none' }}
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
