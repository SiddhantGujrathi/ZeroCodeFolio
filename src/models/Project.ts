// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface Project extends Document {
    _id: ObjectId;
    title: string;
    description: string;
    projectImage?: string;
    imageAiHint?: string;
    tags: string[];
    websiteUrl?: string;
    githubUrl?: string;
    createdAt: Date;
}

export async function getProjectsCollection(): Promise<Collection<Project>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<Project>('projects');
}
