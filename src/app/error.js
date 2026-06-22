'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '20px',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}
      >
        ⚠️
      </div>

      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 800,
          color: 'var(--text-main)',
        }}
      >
        Something went wrong
      </h2>

      <p
        style={{
          color: 'var(--text-light)',
          fontSize: '1rem',
          maxWidth: '480px',
          lineHeight: '1.6',
        }}
      >
        We encountered an unexpected error. This might be due to a temporary
        connectivity issue. Please try again.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
        <button
          onClick={reset}
          className="btn btn-primary"
          style={{ padding: '12px 28px' }}
        >
          Try Again
        </button>
        <a
          href="/"
          className="btn btn-secondary"
          style={{ padding: '12px 28px', textDecoration: 'none' }}
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
