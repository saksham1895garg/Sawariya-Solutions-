import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all jobs
export async function GET() {
  try {
    const careers = await query('SELECT * FROM careers ORDER BY created_at DESC, id DESC');
    const parsedCareers = careers.map(c => ({
      ...c,
      requirements: c.requirements_json ? JSON.parse(c.requirements_json) : []
    }));
    return NextResponse.json(parsedCareers);
  } catch (error) {
    console.error('Failed to fetch careers:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new job
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, department, location, type, description, requirements } = body;

    if (!title || !description) {
      return NextResponse.json({ message: 'Title and description are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO careers (title, department, location, type, description, requirements_json) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        department || 'General',
        location || 'Vadodara, India',
        type || 'Full-Time',
        description,
        requirements ? JSON.stringify(requirements) : JSON.stringify([])
      ]
    );

    return NextResponse.json({ message: 'Job opening created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create job opening:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
