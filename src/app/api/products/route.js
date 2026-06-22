import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET all products
export async function GET() {
  try {
    const products = await query('SELECT * FROM products ORDER BY sort_order ASC, id ASC');
    // Parse benefits_json back to JS array
    const parsedProducts = products.map(p => ({
      ...p,
      benefits: p.benefits_json ? JSON.parse(p.benefits_json) : []
    }));
    return NextResponse.json(parsedProducts);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// POST new product
export async function POST(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tag, title, description, image_url, benefits, cta_text, cta_link, sort_order } = body;

    if (!title) {
      return NextResponse.json({ message: 'Title is required' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO products (tag, title, description, image_url, benefits_json, cta_text, cta_link, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tag || '',
        title,
        description || '',
        image_url || '',
        benefits ? JSON.stringify(benefits) : JSON.stringify([]),
        cta_text || 'Learn More',
        cta_link || '#',
        sort_order || 0
      ]
    );

    return NextResponse.json({ message: 'Product created successfully', id: result.insertId });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
