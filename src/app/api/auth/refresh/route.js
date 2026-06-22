import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'sawariya_secret_jwt_access_token_key_777!';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'sawariya_secret_jwt_refresh_token_key_999!';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshCookie = cookieStore.get('refreshToken');

    if (!refreshCookie || !refreshCookie.value) {
      return NextResponse.json({ message: 'Refresh token missing' }, { status: 401 });
    }

    const refreshToken = refreshCookie.value;

    // 1. Verify Refresh Token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired refresh token' }, { status: 401 });
    }

    // 2. Check in DB if it matches the saved refresh token
    const users = await query('SELECT * FROM admin_users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }

    const user = users[0];
    if (user.refresh_token !== refreshToken) {
      return NextResponse.json({ message: 'Invalid refresh token mapping' }, { status: 401 });
    }

    // 3. Generate a new Access Token
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
