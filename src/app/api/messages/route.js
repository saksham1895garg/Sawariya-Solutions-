import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all messages (requires authentication)
export async function GET(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const messages = await query('SELECT * FROM messages ORDER BY date DESC, id DESC');
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new message (public contact submission)
export async function POST(request) {
  try {
    const { name, email, company, service, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email, and message are required' }, { status: 400 });
    }

    await query(
      'INSERT INTO messages (name, email, company, service, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, company || '', service || 'General', message]
    );

    return NextResponse.json({ message: 'Message sent successfully. We will get back to you shortly!' });
  } catch (error) {
    console.error('Failed to submit message:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
