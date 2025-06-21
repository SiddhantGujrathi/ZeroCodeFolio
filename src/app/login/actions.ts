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

const registerSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
}
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);


async function createSession(userId: ObjectId, email: string) {
    const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await new SignJWT({ userId: userId.toString(), email })
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
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return { message: 'Invalid email or password.' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return { message: 'Invalid email or password.' };
    }

    await createSession(user._id, user.email);

  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
  
  redirect('/dashboard');
}

export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const values = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(values);

  if (!parsed.success) {
      return {
          message: 'Invalid form data.',
          errors: parsed.error.flatten().fieldErrors,
      };
  }

  const { email, password } = parsed.data;

  try {
      const usersCollection = await getUsersCollection();
      const existingUser = await usersCollection.findOne({ email });

      if (existingUser) {
          return { message: 'User with this email already exists.' };
      }

      const password_hash = await bcrypt.hash(password, 10);
      const result = await usersCollection.insertOne({ email, password_hash } as any);

      await createSession(result.insertedId, email);

  } catch (error) {
      console.error(error);
      return { message: 'An unexpected error occurred during registration.' };
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
        return payload as { userId: string; email: string; iat: number; exp: number };
    } catch (error) {
        return null;
    }
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0), path: '/' });
  redirect('/login');
}
