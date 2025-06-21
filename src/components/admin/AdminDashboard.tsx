import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SkillForm, ProjectForm, AchievementForm } from "./PortfolioForms";

export function AdminDashboard() {
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
                    <TabsContent value="skills" className="mt-4">
                        <SkillForm />
                    </TabsContent>
                    <TabsContent value="projects" className="mt-4">
                        <ProjectForm />
                    </TabsContent>
                    <TabsContent value="achievements" className="mt-4">
                        <AchievementForm />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
