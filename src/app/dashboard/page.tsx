import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { DatabaseSetup } from "@/components/admin/DatabaseSetup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { getAboutCollection } from "@/models/About";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { getEducationCollection } from "@/models/Education";
import { getProfileLinksCollection } from "@/models/ProfileLink";
import { getProjectsCollection } from "@/models/Project";
import { getSkillsCollection } from "@/models/Skill";
import { getWorkExperienceCollection } from "@/models/WorkExperience";
import { getLayout } from "@/models/Layout";

function serialize(doc: any) {
    if (doc._id) {
        doc._id = doc._id.toString();
    }
    if (doc.createdAt) {
        doc.createdAt = doc.createdAt.toISOString();
    }
    return doc;
}

export default async function DashboardPage() {
    let props;
    let fetchError: string | null = null;

    try {
        const [
            aboutData,
            skillsData,
            projectsData,
            achievementsData,
            certificationsData,
            educationData,
            workExperienceData,
            profileLinksData,
            layoutData
        ] = await Promise.all([
            getAboutCollection().then(c => c.findOne({})),
            getSkillsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getProjectsCollection().then(c => c.find({}).sort({ createdAt: -1 }).toArray()),
            getAchievementsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getCertificationsCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getEducationCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getWorkExperienceCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getProfileLinksCollection().then(c => c.find({}).sort({ _id: -1 }).toArray()),
            getLayout(),
        ]);
        
        props = {
            about: aboutData ? serialize(aboutData) : null,
            skills: skillsData.map(serialize),
            projects: projectsData.map(serialize),
            achievements: achievementsData.map(serialize),
            certifications: certificationsData.map(serialize),
            education: educationData.map(serialize),
            workExperience: workExperienceData.map(serialize),
            profileLinks: profileLinksData.map(serialize),
            layout: {
                ...layoutData,
                _id: layoutData._id ? layoutData._id.toString() : undefined
            },
        };
    } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        fetchError = `Failed to connect to the database. Please check your MONGODB_URI and ensure your IP is whitelisted in MongoDB Atlas. Error: ${errorMessage}`;
        props = {
            about: null,
            skills: [],
            projects: [],
            achievements: [],
            certifications: [],
            education: [],
            workExperience: [],
            profileLinks: [],
            layout: { navLinks: [], sections: [] },
        };
    }


    return (
        <main className="flex min-h-screen flex-col p-4 sm:p-6 md:p-8 bg-muted/50">
            <div className="w-full max-w-7xl mx-auto space-y-6">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1.5">
                                <CardTitle>Admin Dashboard</CardTitle>
                                <CardDescription>Manage your portfolio content from here.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {fetchError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Database Connection Error</AlertTitle>
                        <AlertDescription>{fetchError}</AlertDescription>
                    </Alert>
                )}

                <DatabaseSetup />
                <AdminDashboard {...props} />
            </div>
        </main>
    );
}
