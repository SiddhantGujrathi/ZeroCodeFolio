import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    AboutForm, SkillForm, ProjectForm, AchievementForm, CertificationForm, EducationForm, WorkExperienceForm, ProfileLinkForm 
} from "./PortfolioForms";
import { 
    AboutDisplay, SkillsDisplay, ProjectsDisplay, AchievementsDisplay, CertificationsDisplay, EducationDisplay, WorkExperienceDisplay, ProfileLinksDisplay 
} from "./PortfolioDisplay";
import { Separator } from "@/components/ui/separator";

import type { About } from "@/models/About";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import type { Certification } from "@/models/Certification";
import type { Education } from "@/models/Education";
import type { WorkExperience } from "@/models/WorkExperience";
import type { ProfileLink } from "@/models/ProfileLink";

type Client<T> = Omit<T, '_id' | 'collection'> & { _id?: string };

interface AdminDashboardProps {
    about: Client<About> | null;
    skills: Client<Skill>[];
    projects: Client<Project>[];
    achievements: Client<Achievement>[];
    certifications: Client<Certification>[];
    education: Client<Education>[];
    workExperience: Client<WorkExperience>[];
    profileLinks: Client<ProfileLink>[];
}

export function AdminDashboard(props: AdminDashboardProps) {
    const { about, skills, projects, achievements, certifications, education, workExperience, profileLinks } = props;
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Admin Control Panel</CardTitle>
                <CardDescription>Manage your portfolio content from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                        <TabsTrigger value="certifications">Certs</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-4 space-y-6">
                        <AboutForm about={about} />
                    </TabsContent>
                    
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

                    <TabsContent value="certifications" className="mt-4 space-y-6">
                        <CertificationForm />
                        <Separator />
                        <CertificationsDisplay certifications={certifications} />
                    </TabsContent>

                    <TabsContent value="education" className="mt-4 space-y-6">
                        <EducationForm />
                        <Separator />
                        <EducationDisplay education={education} />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-4 space-y-6">
                        <WorkExperienceForm />
                        <Separator />
                        <WorkExperienceDisplay workExperience={workExperience} />
                    </TabsContent>
                    
                    <TabsContent value="links" className="mt-4 space-y-6">
                        <ProfileLinkForm />
                        <Separator />
                        <ProfileLinksDisplay profileLinks={profileLinks} />
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    )
}
