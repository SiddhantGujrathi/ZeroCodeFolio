'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    AboutForm, SkillForm, ProjectForm, AchievementForm, CertificationForm, EducationForm, WorkExperienceForm, ProfileLinkForm 
} from "./PortfolioForms";
import { 
    AboutDisplay,
    SkillsDisplay, ProjectsDisplay, AchievementsDisplay, CertificationsDisplay, EducationDisplay, WorkExperienceDisplay, ProfileLinksDisplay 
} from "./PortfolioDisplay";
import { LayoutManager } from "./LayoutManager";

import type { About } from "@/models/About";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import type { Certification } from "@/models/Certification";
import type { Education } from "@/models/Education";
import type { WorkExperience } from "@/models/WorkExperience";
import type { ProfileLink } from "@/models/ProfileLink";
import type { Layout } from "@/models/Layout";

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
    layout: Layout;
}

export function AdminDashboard(props: AdminDashboardProps) {
    const { about, skills, projects, achievements, certifications, education, workExperience, profileLinks, layout } = props;
    
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Admin Control Panel</CardTitle>
                <CardDescription>Manage your portfolio content from here.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="about" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                        <TabsTrigger value="about">About</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                        <TabsTrigger value="certifications">Certs</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="links">Links</TabsTrigger>
                        <TabsTrigger value="layout">Layout</TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                             <AboutDisplay about={about} />
                             <AboutForm about={about} />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="skills" className="mt-6">
                         <div className="grid gap-6 lg:grid-cols-2">
                            <SkillsDisplay skills={skills} />
                            <SkillForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="projects" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <ProjectsDisplay projects={projects} />
                            <ProjectForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="achievements" className="mt-6">
                         <div className="grid gap-6 lg:grid-cols-2">
                            <AchievementsDisplay achievements={achievements} />
                            <AchievementForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="certifications" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <CertificationsDisplay certifications={certifications} />
                            <CertificationForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="education" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <EducationDisplay education={education} />
                            <EducationForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="experience" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <WorkExperienceDisplay workExperience={workExperience} />
                            <WorkExperienceForm />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="links" className="mt-6">
                        <div className="grid gap-6 lg:grid-cols-2">
                            <ProfileLinksDisplay profileLinks={profileLinks} />
                            <ProfileLinkForm />
                        </div>
                    </TabsContent>

                    <TabsContent value="layout" className="mt-6">
                        <LayoutManager layout={layout} />
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    )
}
