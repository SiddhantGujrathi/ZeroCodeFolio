// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Skill extends Document {
  _id: ObjectId;
  title: string;
  image?: string;
  imageAiHint?: string;
  icon?: string;
  order?: number;
}

export async function getSkillsCollection(): Promise<Collection<Skill>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<Skill>('skills');
}
