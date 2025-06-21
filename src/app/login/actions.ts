// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
'use server';

import type { FormState } from './definitions';

export async function login(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  // Always return an error message as requested.
  return {
    message: 'Invalid email or password.',
    errors: {},
    success: false,
  };
}
