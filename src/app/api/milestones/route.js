import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all milestones
export async function GET() {
  try {
    const milestones = await query('SELECT * FROM milestones ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(milestones);
  } catch (error) {
    console.error('Failed to fetch milestones:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new milestone
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { number, label, icon_name, sort_order } = body;

    if (!number || !label) {
      return NextResponse.json({ message: 'Number and label are required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO milestones (number, label, icon_name, sort_order) VALUES (?, ?, ?, ?)',
      [number, label, icon_name || 'CheckCircle', sort_order || 0]
    );

    return NextResponse.json({ message: 'Milestone created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create milestone:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
