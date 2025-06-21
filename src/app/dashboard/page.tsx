import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { DatabaseSetup } from "@/components/admin/DatabaseSetup";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { getAboutCollection } from "@/models/About";
import { getAchievementsCollection } from "@/models/Achievement";
import { getCertificationsCollection } from "@/models/Certification";
import { getEducationCollection } from "@/models/Education";
import { getProfileLinksCollection } from "@/models/ProfileLink";
import { getProjectsCollection } from "@/models/Project";
import { getSkillsCollection } from "@/models/Skill";
import { getWorkExperienceCollection } from "@/models/WorkExperience";

function serialize(doc: any) {
    if (doc._id) {
        doc._id = doc._id.toString();
    }
    return doc;
}

export default async function DashboardPage() {
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
                <DatabaseSetup />
                <AdminDashboard {...props} />
            </div>
        </main>
    );
}
