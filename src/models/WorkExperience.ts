import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface WorkExperience extends Document {
  _id: ObjectId;
  role: string;
  companyName: string;
  description: string;
  icon: string;
  iconHint?: string;
}

export async function getWorkExperienceCollection(): Promise<Collection<WorkExperience>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<WorkExperience>('workExperience');
}
