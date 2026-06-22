import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// PUT update milestone
export async function PUT(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { number, label, icon_name, sort_order } = body;

    if (!number || !label) {
      return NextResponse.json({ message: 'Number and label are required' }, { status: 400 });
    }

    await query(
      'UPDATE milestones SET number = ?, label = ?, icon_name = ?, sort_order = ? WHERE id = ?',
      [number, label, icon_name, sort_order, id]
    );

    return NextResponse.json({ message: 'Milestone updated successfully' });
  } catch (error) {
    console.error('Failed to update milestone:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// DELETE milestone
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM milestones WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error('Failed to delete milestone:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
