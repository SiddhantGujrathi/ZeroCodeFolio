// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Achievement extends Document {
  _id: ObjectId;
  title: string;
  description: string;
  image?: string;
  imageAiHint?: string;
}

export async function getAchievementsCollection(): Promise<Collection<Achievement>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<Achievement>('achievements');
}
