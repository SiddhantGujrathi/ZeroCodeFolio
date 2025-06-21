// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { setupDatabase, type SetupResult } from '@/app/dashboard/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

function VerifyButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                </>
            ) : (
                'Verify Database Collections'
            )}
        </Button>
    );
}

export function DatabaseSetup() {
    const [state, formAction] = useActionState(setupDatabase, null);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Database Health Check</CardTitle>
                <CardDescription>
                    If you're unable to save data, it might be a database permissions issue.
                    Click the button below to verify that the application has the necessary permissions to create collections in your database.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <VerifyButton />
                </form>

                {state && (
                    <div className="mt-4 space-y-4">
                        {state.overall.success ? (
                             <Alert className="border-green-500/50 text-green-700 dark:text-green-400 [&_svg]:text-green-700 dark:[&_svg]:text-green-400">
                                <CheckCircle className="h-4 w-4" />
                                <AlertTitle className="font-bold text-green-800 dark:text-green-300">Verification Complete</AlertTitle>
                                <AlertDescription>{state.overall.message}</AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Verification Failed</AlertTitle>
                                <AlertDescription>
                                    {state.overall.message}
                                    <p className="mt-2 font-semibold">Please check your MongoDB Atlas user permissions. The connected user may need the `dbAdmin` role on the 'portfolio' database, or at least `readWrite` permissions for all its collections.</p>
                                </AlertDescription>
                            </Alert>
                        )}
                        {state.details.length > 0 && (
                            <ul className="space-y-2 text-sm">
                                {state.details.map(detail => (
                                    <li key={detail.collection} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                        {detail.status === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                                        {detail.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                                        <span className="font-mono text-xs font-semibold">{detail.collection}:</span>
                                        <span className="text-muted-foreground">{detail.message}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
