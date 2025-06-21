import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface User extends Document {
  _id: ObjectId;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
}

// Helper function to get the users collection
export async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<User>('User');
}
