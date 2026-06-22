import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update job
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, department, location, type, description, requirements } = body;

    if (!title || !description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }

    await query(
      `UPDATE careers SET 
        title = ?, department = ?, location = ?, type = ?, 
        description = ?, requirements_json = ? 
       WHERE id = ?`,
      [
        title,
        department,
        location,
        type,
        description,
        requirements ? JSON.stringify(requirements) : JSON.stringify([]),
        id
      ]
    );

    return NextResponse.json({ message: 'Job opening updated successfully' });
  } catch (error) {
    console.error('Failed to update job opening:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE job
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM careers WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Job opening deleted successfully' });
  } catch (error) {
    console.error('Failed to delete job opening:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
