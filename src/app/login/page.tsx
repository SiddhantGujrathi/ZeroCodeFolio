'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login, register } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { FormState } from './definitions';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/50">
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function LoginForm() {
  const initialState: FormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(login, initialState);
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
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-login">Email</Label>
            <Input id="email-login" name="email" type="email" placeholder="m@example.com" required />
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

function RegisterForm() {
  const initialState: FormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(register, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Invalid form data.') {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to create a new account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email-register">Email</Label>
            <Input id="email-register" name="email" type="email" placeholder="m@example.com" required />
             {state.errors?.email && <p className="text-sm text-destructive">{state.errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-register">Password</Label>
            <Input id="password-register" name="password" type="password" required />
            {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password}</p>}
          </div>
          <SubmitButton>Register</SubmitButton>
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
