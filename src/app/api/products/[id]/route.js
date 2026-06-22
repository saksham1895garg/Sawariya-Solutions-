import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update product
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { tag, title, description, image_url, benefits, cta_text, cta_link, sort_order } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await query(
      `UPDATE products SET 
        tag = ?, title = ?, description = ?, image_url = ?, 
        benefits_json = ?, cta_text = ?, cta_link = ?, sort_order = ? 
       WHERE id = ?`,
      [
        tag,
        title,
        description,
        image_url,
        benefits ? JSON.stringify(benefits) : JSON.stringify([]),
        cta_text,
        cta_link,
        sort_order,
        id
      ]
    );

    return NextResponse.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
