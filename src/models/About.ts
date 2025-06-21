import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface About extends Document {
  _id?: ObjectId;
  name: string;
  tagline?: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  profileImage?: string;
}

export async function getAboutCollection(): Promise<Collection<About>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<About>('about');
}
