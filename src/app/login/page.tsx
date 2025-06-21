'use client';

import { useFormStatus } from 'react-dom';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { FormState } from './definitions';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/50">
      <LoginForm />
    </main>
  );
}

function LoginForm() {
  const initialState: FormState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(login, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Invalid form data.') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input id="email-login" name="email" type="email" placeholder="admin@example.com" required />
            {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-login">Password</Label>
            <Input id="password-login" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password}</p>}
          </div>
          <SubmitButton>Log In</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}


function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Submitting...' : children}
    </Button>
  );
}
