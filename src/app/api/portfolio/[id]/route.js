import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update portfolio
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { category, title, client, description, image_url, link, sort_order } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await query(
      `UPDATE portfolio SET 
        category = ?, title = ?, client = ?, description = ?, 
        image_url = ?, link = ?, sort_order = ? 
       WHERE id = ?`,
      [category, title, client, description, image_url, link, sort_order, id]
    );

    return NextResponse.json({ message: 'Portfolio item updated successfully' });
  } catch (error) {
    console.error('Failed to update portfolio item:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE portfolio
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM portfolio WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Failed to delete portfolio item:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
