// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email('Please enter a valid email.').trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .trim(),
});

export type FormState = {
  message: string | null;
  errors?: {
    email?: string[];
    password?: string[];
  };
  success?: boolean;
};
