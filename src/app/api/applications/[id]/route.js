import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// DELETE application by ID
export async function DELETE(request, { params }) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM applications WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Failed to delete application:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
