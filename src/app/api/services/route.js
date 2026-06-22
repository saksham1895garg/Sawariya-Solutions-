import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all services
export async function GET() {
  try {
    const services = await query('SELECT * FROM services ORDER BY sort_order ASC, id ASC');
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new service
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, icon_name, sort_order } = await request.json();

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO services (title, description, icon_name, sort_order) VALUES (?, ?, ?, ?)',
      [title, description, icon_name || 'Cpu', sort_order || 0]
    );

    return NextResponse.json({ message: 'Service created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
