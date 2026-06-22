import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'sawariya_secret_jwt_refresh_token_key_999!';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get('refreshToken');

    if (refreshCookie && refreshCookie.value) {
      try {
        const decoded = jwt.verify(refreshCookie.value, JWT_REFRESH_SECRET);
        // Clear refresh token in database
        await query('UPDATE admin_users SET refresh_token = NULL WHERE id = ?', [decoded.id]);
      } catch (err) {
        // Ignore token verification errors on logout
      }
    }

    // Clear cookie
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
