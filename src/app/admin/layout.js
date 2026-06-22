'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, clearCredentials } from '@/lib/store/authSlice';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Attempt token refresh to rehydrate credentials
        const res = await fetch('/api/auth/refresh', { method: 'POST' });
        const data = await res.json();
        
        if (res.ok && data.accessToken) {
          dispatch(setCredentials({ token: data.accessToken, user: data.user }));
        } else {
          dispatch(clearCredentials());
          router.push('/login');
        }
      } catch (err) {
        console.error('Session verification failed:', err);
        dispatch(clearCredentials());
        router.push('/login');
      } finally {
        setCheckingAuth(false);
      }
    };

    if (!isAuthenticated) {
      checkSession();
    } else {
      setCheckingAuth(false);
    }
  }, [isAuthenticated, dispatch, router]);

  if (checkingAuth || (loading && !isAuthenticated)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,74,173,0.1)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.9rem' }}>Verifying Admin Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
