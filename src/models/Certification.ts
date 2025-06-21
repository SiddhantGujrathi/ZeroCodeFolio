import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Certification extends Document {
  _id: ObjectId;
  title: string;
  issuedBy: string;
  date: string;
  certificateUrl: string;
  image?: string;
  imageAiHint?: string;
}

export async function getCertificationsCollection(): Promise<Collection<Certification>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<Certification>('certifications');
}
