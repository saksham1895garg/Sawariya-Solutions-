import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET single blog
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const blogs = await query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (blogs.length === 0) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blogs[0]);
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// PUT update blog
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { category, title, excerpt, content, image_url, author, date } = body;

    if (!title || !content) {
      return NextResponse.json({ message: 'Title and content are required' }, { status: 400 });
    }

    // Format date properly
    const formattedDate = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    await query(
      `UPDATE blogs SET 
        category = ?, title = ?, excerpt = ?, content = ?, 
        image_url = ?, author = ?, date = ? 
       WHERE id = ?`,
      [category, title, excerpt, content, image_url, author, formattedDate, id]
    );

    return NextResponse.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Failed to update blog:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE blog
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM blogs WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Failed to delete blog:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
