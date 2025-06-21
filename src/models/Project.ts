import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Project extends Document {
    _id: ObjectId;
    title: string;
    description: string;
    image: string;
    imageAiHint: string;
    tags: string[];
    links: {
        name: string;
        url:string;
        icon: string;
    }[];
}

export async function getProjectsCollection(): Promise<Collection<Project>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<Project>('Project');
}
