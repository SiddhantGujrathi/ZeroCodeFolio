// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
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
  order?: number;
}

export async function getCertificationsCollection(): Promise<Collection<Certification>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<Certification>('certifications');
}
