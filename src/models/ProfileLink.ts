import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface ProfileLink extends Document {
  _id: ObjectId;
  platform: string;
  url: string;
  icon: string;
  iconHint: string;
}

export async function getProfileLinksCollection(): Promise<Collection<ProfileLink>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<ProfileLink>('profileLinks');
}
