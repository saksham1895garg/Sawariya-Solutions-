import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update testimonial
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, role, company, feedback, image_url, rating, sort_order } = body;

    if (!name || !feedback) {
      return NextResponse.json({ message: 'Name and feedback are required' }, { status: 400 });
    }

    await query(
      `UPDATE testimonials SET 
        name = ?, role = ?, company = ?, feedback = ?, 
        image_url = ?, rating = ?, sort_order = ? 
       WHERE id = ?`,
      [name, role, company, feedback, image_url, rating, sort_order, id]
    );

    return NextResponse.json({ message: 'Testimonial updated successfully' });
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE testimonial
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM testimonials WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Failed to delete testimonial:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
