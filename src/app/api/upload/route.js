import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/imagekit';
import { verifyAdmin } from '@/lib/auth-helper';

export async function POST(request) {
  try {
    // 1. Verify admin permissions
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse form data
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Upload file
    const url = await uploadImage(buffer, file.name);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
  }
}
