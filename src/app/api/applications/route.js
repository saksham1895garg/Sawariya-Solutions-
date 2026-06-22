import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all applications (requires authentication)
export async function GET(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const applications = await query(
      `SELECT a.*, c.title as job_title 
       FROM applications a 
       LEFT JOIN careers c ON a.job_id = c.id 
       ORDER BY a.date DESC, a.id DESC`
    );
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Failed to fetch applications:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST submit application (public)
export async function POST(request) {
  try {
    const { job_id, name, email, phone, resume_url, message } = await request.json();

    if (!job_id || !name || !email) {
      return NextResponse.json({ message: 'Job selection, name, and email are required' }, { status: 400 });
    }

    await query(
      'INSERT INTO applications (job_id, name, email, phone, resume_url, message) VALUES (?, ?, ?, ?, ?, ?)',
      [job_id, name, email, phone || '', resume_url || '', message || '']
    );

    return NextResponse.json({ message: 'Application submitted successfully! Our recruiting team will review it.' });
  } catch (error) {
    console.error('Failed to submit application:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
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
