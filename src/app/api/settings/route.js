import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAdmin } from '@/lib/auth-helper';

// GET settings (row with ID = 1)
export async function GET() {
  try {
    const settings = await query('SELECT * FROM settings WHERE id = 1');
    if (settings.length === 0) {
      return NextResponse.json({ message: 'Settings not found' }, { status: 404 });
    }
    return NextResponse.json(settings[0]);
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}

// PUT settings (requires authentication)
export async function PUT(request) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      site_name, logo_url, favicon_url, primary_color, secondary_color,
      meta_title, meta_description, meta_keywords,
      facebook_url, instagram_url, linkedin_url, whatsapp_num, youtube_url, twitter_url,
      email, phone, hours, address, map_url
    } = body;

    await query(
      `UPDATE settings SET 
        site_name = ?, logo_url = ?, favicon_url = ?, primary_color = ?, secondary_color = ?,
        meta_title = ?, meta_description = ?, meta_keywords = ?,
        facebook_url = ?, instagram_url = ?, linkedin_url = ?, whatsapp_num = ?, youtube_url = ?, twitter_url = ?,
        email = ?, phone = ?, hours = ?, address = ?, map_url = ?
       WHERE id = 1`,
      [
        site_name, logo_url, favicon_url, primary_color, secondary_color,
        meta_title, meta_description, meta_keywords,
        facebook_url, instagram_url, linkedin_url, whatsapp_num, youtube_url, twitter_url,
        email, phone, hours, address, map_url
      ]
    );

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ message: 'Database error' }, { status: 500 });
  }
}
