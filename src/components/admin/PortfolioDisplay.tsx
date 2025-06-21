'use client';

import type { ComponentProps } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { stringToIconMap } from "@/lib/icon-map";
import { Globe } from "lucide-react";

import type { About } from "@/models/About";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import type { Certification } from "@/models/Certification";
import type { Education } from "@/models/Education";
import type { WorkExperience } from "@/models/WorkExperience";
import type { ProfileLink } from "@/models/ProfileLink";


type Client<T> = Omit<T, '_id' | 'collection'> & { _id?: string };

function SectionDisplay<T>({ title, items, children, emptyText = "Nothing is added yet." }: { title: string, items: T[], children: (item: T) => React.ReactNode, emptyText?: string }) {
    if (items.length === 0) {
        return (
            <div>
                <h3 className="text-xl font-bold tracking-tight">{title}</h3>
                <p className="text-muted-foreground text-center py-4">{emptyText}</p>
            </div>
        );
    }
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
            {children(items as any)}
        </div>
    );
}

function DynamicIcon({ name, ...props }: { name: string } & ComponentProps<"svg">) {
  const Icon = stringToIconMap[name] || Globe;
  return <Icon {...props} />;
}

export function AboutDisplay({ about }: { about: Client<About> | null }) {
    if (!about) {
        return null;
    }
    return (
         <div className="space-y-4">
             <h3 className="text-xl font-bold tracking-tight">Current Info</h3>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border">
                            <Image src={about.profileImage} alt={about.name} fill className="object-cover" />
                        </div>
                        <div>
                            <CardTitle>{about.name}</CardTitle>
                            <CardDescription>{about.email} | {about.phone} | {about.location}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{about.bio}</p>
                    <a href={about.resumeUrl} className="text-sm text-primary hover:underline mt-2 inline-block">View Resume</a>
                </CardContent>
            </Card>
        </div>
    );
}


export function SkillsDisplay({ skills }: { skills: Client<Skill>[] }) {
    return (
        <SectionDisplay title="Current Skills" items={skills}>
            {(items: Client<Skill>[]) => (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {items.map(skill => (
                        <Card key={skill._id} className="p-4 flex flex-col items-center justify-center text-center">
                            <div className="relative h-12 w-12">
                                <Image src={skill.image} alt={skill.title} fill className="object-contain" />
                            </div>
                            <p className="mt-2 font-semibold text-sm">{skill.title}</p>
                        </Card>
                    ))}
                </div>
            )}
        </SectionDisplay>
    );
}

export function ProjectsDisplay({ projects }: { projects: Client<Project>[] }) {
    return (
        <SectionDisplay title="Current Projects" items={projects}>
             {(items: Client<Project>[]) => (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(project => (
                        <Card key={project._id} className="overflow-hidden">
                             <CardHeader className="p-0">
                                <div className="aspect-video overflow-hidden border-b">
                                    <Image src={project.projectImage} alt={project.title} width={400} height={250} className="w-full h-full object-cover" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="text-lg">{project.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">{project.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="p-4 pt-0">
                                <div className="flex flex-wrap gap-1">
                                    {project.tags.map(tag => (
                                        <Badge key={tag} variant="secondary">{tag}</Badge>
                                    ))}
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
             )}
        </SectionDisplay>
    );
}

export function AchievementsDisplay({ achievements }: { achievements: Client<Achievement>[] }) {
    return (
        <SectionDisplay title="Current Achievements" items={achievements}>
            {(items: Client<Achievement>[]) => (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(achievement => (
                        <Card key={achievement._id}>
                            <CardHeader className="p-0">
                                <div className="aspect-video overflow-hidden border-b">
                                     <Image src={achievement.image} alt={achievement.title} width={400} height={250} className="w-full h-full object-cover" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">{achievement.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </SectionDisplay>
    );
}


export function CertificationsDisplay({ certifications }: { certifications: Client<Certification>[] }) {
    return (
        <SectionDisplay title="Current Certifications" items={certifications}>
            {(items: Client<Certification>[]) => (
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(cert => (
                        <Card key={cert._id}>
                             <CardHeader className="p-0">
                                <div className="aspect-video overflow-hidden border-b">
                                     <Image src={cert.image} alt={cert.title} width={400} height={250} className="w-full h-full object-cover" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <CardTitle className="text-lg">{cert.title}</CardTitle>
                                <CardDescription className="text-sm mt-1">{cert.issuedBy} - {cert.date}</CardDescription>
                                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary text-sm mt-2 inline-block hover:underline">View Certificate</a>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </SectionDisplay>
    );
}

export function EducationDisplay({ education }: { education: Client<Education>[] }) {
    return (
        <SectionDisplay title="Current Education" items={education}>
             {(items: Client<Education>[]) => (
                 <div className="space-y-2">
                    {items.map(edu => (
                        <Card key={edu._id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <DynamicIcon name={edu.icon} className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-base">{edu.degreeName} at {edu.collegeName}</CardTitle>
                                    <CardDescription className="text-sm">{edu.period} | CGPA: {edu.cgpa}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
             )}
        </SectionDisplay>
    );
}

export function WorkExperienceDisplay({ workExperience }: { workExperience: Client<WorkExperience>[] }) {
    return (
        <SectionDisplay title="Current Work Experience" items={workExperience}>
             {(items: Client<WorkExperience>[]) => (
                 <div className="space-y-2">
                    {items.map(exp => (
                        <Card key={exp._id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <DynamicIcon name={exp.icon} className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-base">{exp.role} at {exp.companyName}</CardTitle>
                                    <CardDescription className="text-sm">{exp.description}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
             )}
        </SectionDisplay>
    );
}


export function ProfileLinksDisplay({ profileLinks }: { profileLinks: Client<ProfileLink>[] }) {
    return (
        <SectionDisplay title="Current Profile Links" items={profileLinks}>
             {(items: Client<ProfileLink>[]) => (
                 <div className="space-y-2">
                    {items.map(link => (
                        <Card key={link._id}>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <DynamicIcon name={link.icon} className="h-8 w-8 text-primary" />
                                <div>
                                    <CardTitle className="text-base">{link.platform}</CardTitle>
                                    <CardDescription className="text-sm truncate">{link.url}</CardDescription>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
             )}
        </SectionDisplay>
    );
}
