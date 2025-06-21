import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    AboutForm, SkillForm, ProjectForm, AchievementForm, CertificationForm, EducationForm, WorkExperienceForm, ProfileLinkForm 
} from "./PortfolioForms";
import { 
    AboutDisplay,
    SkillsDisplay, ProjectsDisplay, AchievementsDisplay, CertificationsDisplay, EducationDisplay, WorkExperienceDisplay, ProfileLinksDisplay 
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
                        <AboutDisplay about={about} />
                        <Separator />
                        <AboutForm about={about} />
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-4 space-y-6">
                        <SkillsDisplay skills={skills} />
                        <Separator />
                        <SkillForm />
                    </TabsContent>

                    <TabsContent value="projects" className="mt-4 space-y-6">
                        <ProjectsDisplay projects={projects} />
                        <Separator />
                        <ProjectForm />
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-4 space-y-6">
                        <AchievementsDisplay achievements={achievements} />
                        <Separator />
                        <AchievementForm />
                    </TabsContent>

                    <TabsContent value="certifications" className="mt-4 space-y-6">
                        <CertificationsDisplay certifications={certifications} />
                        <Separator />
                        <CertificationForm />
                    </TabsContent>

                    <TabsContent value="education" className="mt-4 space-y-6">
                        <EducationDisplay education={education} />
                        <Separator />
                        <EducationForm />
                    </TabsContent>

                    <TabsContent value="experience" className="mt-4 space-y-6">
                        <WorkExperienceDisplay workExperience={workExperience} />
                        <Separator />
                        <WorkExperienceForm />
                    </TabsContent>
                    
                    <TabsContent value="links" className="mt-4 space-y-6">
                        <ProfileLinksDisplay profileLinks={profileLinks} />
                        <Separator />
                        <ProfileLinkForm />
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    )
}
