import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface WorkExperience extends Document {
  _id: ObjectId;
  role: string;
  companyName: string;
  description: string;
  icon: string;
  iconHint: string;
}

export async function getWorkExperienceCollection(): Promise<Collection<WorkExperience>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<WorkExperience>('workExperience');
}
