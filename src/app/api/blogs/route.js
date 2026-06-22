import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all blogs
export async function GET() {
  try {
    const blogs = await query('SELECT * FROM blogs ORDER BY date DESC, id DESC');
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new blog
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, title, excerpt, content, image_url, author, date } = body;

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO blogs (category, title, excerpt, content, image_url, author, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        category || 'General',
        title,
        excerpt || '',
        content,
        image_url || '',
        author || 'Chief Architect',
        date || new Date().toISOString().split('T')[0]
      ]
    );

    return NextResponse.json({ message: 'Blog created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create blog:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
