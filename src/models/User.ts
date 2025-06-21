import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface User extends Document {
  _id: ObjectId;
  email: string;
  password_hash: string;
}

// Helper function to get the users collection
export async function getUsersCollection(): Promise<Collection<User>> {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB || 'portfolio';
  const db = client.db(dbName);
  return db.collection<User>('users');
}
