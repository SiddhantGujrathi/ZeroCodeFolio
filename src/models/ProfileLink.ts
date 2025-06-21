import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface ProfileLink extends Document {
  _id: ObjectId;
  platform: string;
  url: string;
  icon: string;
  iconHint?: string;
}

export async function getProfileLinksCollection(): Promise<Collection<ProfileLink>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<ProfileLink>('profileLinks');
}
