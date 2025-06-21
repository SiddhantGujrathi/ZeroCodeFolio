import { getSession, logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        // This should not happen due to middleware, but as a safeguard
        redirect('/login');
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Dashboard</CardTitle>
                    <CardDescription>Welcome back to your portfolio dashboard!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm text-muted-foreground">You are logged in as:</p>
                        <p className="font-semibold">{session.email}</p>
                    </div>
                    <form action={logout}>
                        <Button type="submit" variant="outline" className="w-full">
                            Log Out
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
