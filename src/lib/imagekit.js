import ImageKit from 'imagekit';
import fs from 'fs';
import path from 'path';

let imagekit = null;

if (
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
  console.log('ImageKit Integration Initialized.');
} else {
  console.log('ImageKit credentials missing in env. Falling back to local file storage.');
}

/**
 * Uploads a file (Buffer) to ImageKit, or falls back to local storage if credentials are not configured.
 * @param {Buffer} fileBuffer The file buffer
 * @param {string} fileName The file name
 * @param {string} folder Optional folder path (for ImageKit)
 * @returns {Promise<string>} The uploaded image URL
 */
export async function uploadImage(fileBuffer, fileName, folder = 'sawariya') {
  if (imagekit) {
    try {
      const response = await imagekit.upload({
        file: fileBuffer, // can be buffer, base64, or url
        fileName: fileName,
        folder: folder,
      });
      return response.url;
    } catch (error) {
      console.error('ImageKit upload failed, trying local fallback:', error);
      // Fall through to local fallback
    }
  }

  // Local fallback: save to /public/uploads/
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadDir, uniqueName);
    await fs.promises.writeFile(filePath, fileBuffer);
    
    return `/uploads/${uniqueName}`;
  } catch (error) {
    console.error('Local fallback upload failed:', error);
    throw error;
  }
}
