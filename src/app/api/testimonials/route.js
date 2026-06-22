import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all testimonials
export async function GET() {
  try {
    const testimonials = await query('SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC');
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new testimonial
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, company, feedback, image_url, rating, sort_order } = body;

    if (!name || !feedback) {
      return NextResponse.json({ message: 'Name and feedback are required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO testimonials (name, role, company, feedback, image_url, rating, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        role || '',
        company || '',
        feedback,
        image_url || '',
        rating || 5,
        sort_order || 0
      ]
    );

    return NextResponse.json({ message: 'Testimonial created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create testimonial:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
