import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Skill extends Document {
  _id: ObjectId;
  title: string;
  image: string;
  imageAiHint?: string;
}

export async function getSkillsCollection(): Promise<Collection<Skill>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<Skill>('skills');
}
