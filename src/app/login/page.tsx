// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
'use client';

import { useActionState } from 'react';
import { login } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { PortfolioIcon } from '@/components/icons';

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
        <div className="w-full max-w-sm">
             <div className="text-center mb-6">
                <Link href="/" className="inline-flex items-center space-x-2">
                    <PortfolioIcon className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">Siddhant Gujrathi</span>
                </Link>
             </div>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {state?.message && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Login Failed</AlertTitle>
                                <AlertDescription>{state.message}</AlertDescription>
                            </Alert>
                        )}
                        
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
