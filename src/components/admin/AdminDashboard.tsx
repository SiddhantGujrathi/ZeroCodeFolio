import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SkillForm, ProjectForm, AchievementForm } from "./PortfolioForms";
import { SkillsDisplay, ProjectsDisplay, AchievementsDisplay } from "./PortfolioDisplay";
import { Separator } from "@/components/ui/separator";

interface AdminDashboardProps {
    skills: any[];
    projects: any[];
    achievements: any[];
}

export function AdminDashboard({ skills, projects, achievements }: AdminDashboardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Admin Control Panel</CardTitle>
                <CardDescription>Manage your portfolio content from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="skills" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="skills">Manage Skills</TabsTrigger>
                        <TabsTrigger value="projects">Manage Projects</TabsTrigger>
                        <TabsTrigger value="achievements">Manage Achievements</TabsTrigger>
                    </TabsList>
                    <TabsContent value="skills" className="mt-4 space-y-6">
                        <SkillForm />
                        <Separator />
                        <SkillsDisplay skills={skills} />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-4 space-y-6">
                        <ProjectForm />
                        <Separator />
                        <ProjectsDisplay projects={projects} />
                    </TabsContent>
                    <TabsContent value="achievements" className="mt-4 space-y-6">
                        <AchievementForm />
                        <Separator />
                        <AchievementsDisplay achievements={achievements} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
