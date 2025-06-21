import type { Collection, Document, WithId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface About extends Document {
  name: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  resumeUrl: string;
  profileImage: string;
}

export async function getAboutCollection(): Promise<Collection<About>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<About>('about');
}
