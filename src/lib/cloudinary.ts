'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// The Cloudinary URL environment variable is automatically parsed,
// so explicit configuration isn't strictly necessary if it's set.
// This is here for clarity and as a fallback.
if (!process.env.CLOUDINARY_URL) {
  console.error("Cloudinary URL not set. Please check your environment variables.");
}

export async function uploadImage(file: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'portfolio',
      transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image.');
  }
}
