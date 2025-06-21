import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Education extends Document {
  _id: ObjectId;
  collegeName: string;
  degreeName: string;
  period: string;
  cgpa: string;
  icon: string;
  iconHint?: string;
}

export async function getEducationCollection(): Promise<Collection<Education>> {
  const client = await clientPromise;
  const db = client.db();
  return db.collection<Education>('education');
}
