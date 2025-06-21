'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '@/models/User';
import { redirect } from 'next/navigation';
import type { FormState } from './definitions';
import type { ObjectId } from 'mongodb';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, "Password is required"),
});

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);


async function createSession(userId: ObjectId, email: string, role: 'admin' | 'user') {
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await new SignJWT({ userId: userId.toString(), email, role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expirationTime)
      .sign(secretKey);

    cookies().set('session', session, {
      expires: expirationTime,
      httpOnly: true,
      path: '/',
    });
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(formData.entries());
  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return {
      message: 'Invalid form data.',
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password } = parsed.data;

  try {
    const usersCollection = await getUsersCollection();

    // Check if an admin user exists.
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });

    // If no admin exists, create the first one with the specified credentials.
    if (adminCount === 0 && email === 'swami@example.com' && password === 'swami123') {
        const password_hash = await bcrypt.hash(password, 10);
        const newUser = {
            email,
            password_hash,
            role: 'admin' as const,
        };
        const result = await usersCollection.insertOne(newUser);
        if (!result.acknowledged) {
            return { message: 'Database did not acknowledge the insert operation.' };
        }
        await createSession(result.insertedId, email, 'admin');
        redirect('/dashboard');
    }
    
    // Normal login flow
    const user = await usersCollection.findOne({ email });

    if (!user || user.role !== 'admin') {
      return { message: 'Invalid credentials or insufficient permissions.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { message: 'Invalid credentials or insufficient permissions.' };
    }

    await createSession(user._id, user.email, user.role);

  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.name === 'MongoNetworkError') {
        return { message: 'Failed to connect to the database. Please check your network connection and credentials.' };
    }
    return { message: 'An unexpected error occurred. Please try again.' };
  }
  
  redirect('/dashboard');
}


export async function getSession() {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return null;
    try {
        const { payload } = await jwtVerify(sessionCookie, secretKey, {
            algorithms: ['HS256'],
        });
        return payload as { userId: string; email: string; role: 'admin' | 'user'; iat: number; exp: number };
    } catch (error) {
        return null;
    }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0), path: '/' });
  redirect('/login');
}
