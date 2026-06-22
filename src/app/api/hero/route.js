import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

export async function GET() {
  try {
    const hero = await query('SELECT * FROM hero WHERE id = 1');
    if (hero.length === 0) {
      return NextResponse.json({ message: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json(hero[0]);
  } catch (error) {
    console.error('Failed to get hero:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      subtitle, title, description,
      primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
      image_url
    } = body;

    await query(
      `UPDATE hero SET 
        subtitle = ?, title = ?, description = ?,
        primary_cta_text = ?, primary_cta_link = ?, secondary_cta_text = ?, secondary_cta_link = ?,
        image_url = ?
       WHERE id = 1`,
      [
        subtitle, title, description,
        primary_cta_text, primary_cta_link, secondary_cta_text, secondary_cta_link,
        image_url
      ]
    );

    return NextResponse.json({ message: 'Hero updated successfully' });
  } catch (error) {
    console.error('Failed to update hero:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
