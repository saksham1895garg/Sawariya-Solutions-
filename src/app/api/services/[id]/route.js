import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update service
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, description, icon_name, sort_order } = await request.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    await query(
      'UPDATE services SET title = ?, description = ?, icon_name = ?, sort_order = ? WHERE id = ?',
      [title, description, icon_name, sort_order, id]
    );

    return NextResponse.json({ message: 'Service updated successfully' });
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM services WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
