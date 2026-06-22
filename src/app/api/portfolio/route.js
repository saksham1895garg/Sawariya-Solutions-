import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all portfolio items
export async function GET() {
  try {
    const portfolio = await query('SELECT * FROM portfolio ORDER BY sort_order ASC, id DESC');
    return NextResponse.json(portfolio);
  } catch (error) {
    console.error('Failed to fetch portfolio:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new portfolio item
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, title, client, description, image_url, link, sort_order } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO portfolio (category, title, client, description, image_url, link, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category || 'General',
        title,
        client || '',
        description || '',
        image_url || '',
        link || '#',
        sort_order || 0
      ]
    );

    return NextResponse.json({ message: 'Portfolio item created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create portfolio item:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
