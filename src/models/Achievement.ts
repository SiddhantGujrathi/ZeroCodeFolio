import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Achievement extends Document {
  _id: ObjectId;
  title: string;
  description: string;
}

export async function getAchievementsCollection(): Promise<Collection<Achievement>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<Achievement>('Achievement');
}
