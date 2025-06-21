import { getSession, logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

import { getAboutCollection } from "@/models/About";
import { getSkillsCollection } from "@/models/Skill";
import { getProjectsCollection } from "@/models/Project";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { getEducationCollection } from "@/models/Education";
import { getWorkExperienceCollection } from "@/models/WorkExperience";
import { getProfileLinksCollection } from "@/models/ProfileLink";

function serialize(doc: any) {
    if (doc._id) {
        doc._id = doc._id.toString();
    }
    return doc;
}

export default async function DashboardPage() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        redirect('/login');
    }

    const [
        aboutData,
        skillsData,
        projectsData,
        achievementsData,
        certificationsData,
        educationData,
        workExperienceData,
        profileLinksData
    ] = await Promise.all([
        getAboutCollection().then(c => c.findOne({})),
        getSkillsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
        getProjectsCollection().then(c => c.find({}).sort({ createdAt: -1 }).toArray()),
        getAchievementsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
        getCertificationsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
        getEducationCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
        getWorkExperienceCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
        getProfileLinksCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
    ]);
    
    const props = {
        about: aboutData ? serialize(aboutData) : null,
        skills: skillsData.map(serialize),
        projects: projectsData.map(serialize),
        achievements: achievementsData.map(serialize),
        certifications: certificationsData.map(serialize),
        education: educationData.map(serialize),
        workExperience: workExperienceData.map(serialize),
        profileLinks: profileLinksData.map(serialize),
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-4 bg-muted/50">
            <div className="w-full max-w-6xl space-y-6">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <CardTitle>Admin Dashboard</CardTitle>
                                <CardDescription>Welcome back, {session.email}!</CardDescription>
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
                <AdminDashboard {...props} />
            </div>
        </main>
    );
}
