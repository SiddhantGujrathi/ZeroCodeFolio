import { getSession, logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getSkillsCollection } from "@/models/Skill";
import { getProjectsCollection } from "@/models/Project";
import { getAchievementsCollection } from "@/models/Achievement";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    let skills: any[] = [];
    let projects: any[] = [];
    let achievements: any[] = [];

    if (session.role === 'admin') {
        const skillsCollection = await getSkillsCollection();
        skills = (await skillsCollection.find({}).sort({ _id: -1 }).toArray()).map(d => ({...d, _id: d._id.toString()}));
        
        const projectsCollection = await getProjectsCollection();
        projects = (await projectsCollection.find({}).sort({ _id: -1 }).toArray()).map(d => ({...d, _id: d._id.toString()}));

        const achievementsCollection = await getAchievementsCollection();
        achievements = (await achievementsCollection.find({}).sort({ _id: -1 }).toArray()).map(d => ({...d, _id: d._id.toString()}));
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4 bg-muted/50">
            <div className="w-full max-w-4xl space-y-6">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <CardTitle>Dashboard</CardTitle>
                                <CardDescription>Welcome back!</CardDescription>
                            </div>
                            <form action={logout}>
                                <Button type="submit" variant="outline">
                                    Log Out
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                           <p className="font-semibold">{session.email}</p>
                           {session.role === 'admin' && <Badge>Admin</Badge>}
                        </div>
                    </CardContent>
                </Card>

                {session.role === 'admin' && <AdminDashboard skills={skills} projects={projects} achievements={achievements} />}
            </div>
        </main>
    );
}
