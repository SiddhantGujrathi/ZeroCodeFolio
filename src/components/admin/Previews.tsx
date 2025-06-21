
'use client';

import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Download, ExternalLink, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SlateViewer } from "./SlateViewer";
import { stringToIconMap } from "@/lib/icon-map";
import { SkillHexagon } from "../shared/SkillHexagon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import type { About } from "@/models/About";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import type { Certification } from "@/models/Certification";
import type { Education } from "@/models/Education";
import type { WorkExperience } from "@/models/WorkExperience";
import type { ProfileLink } from "@/models/ProfileLink";

type Client<T> = Omit<T, '_id' | 'collection' | 'createdAt'> & { _id?: string, createdAt?: string };

// Wrapper for all previews
function PreviewWrapper({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <CardTitle>Live Preview</CardTitle>
                    <div className="flex items-center">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    </div>
                </div>
                <CardDescription>
                    This is a preview of how the &quot;{title}&quot; section will appear to visitors on your site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-muted/30 border-2 border-foreground/40 rounded-lg p-4 sm:p-6 overflow-x-auto">
                    <div className="max-w-full w-full">
                        {children}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Placeholder for empty sections
function PreviewPlaceholder({ sectionName }: { sectionName: string }) {
    return (
        <div className="text-center text-muted-foreground py-8">
            <p>No content added for the &quot;{sectionName}&quot; section yet.</p>
            <p className="text-sm mt-1">Add items using the form below to see a preview.</p>
        </div>
    );
}

// Individual Previews
export function AboutPreview({ about }: { about: Client<About> | null }) {
    return (
        <PreviewWrapper title="About / Hero">
            {!about ? (
                <PreviewPlaceholder sectionName="About" />
            ) : (
                <div className="container flex flex-col items-center justify-center py-6 text-center">
                    <Avatar className="h-40 w-40 border-4 border-primary">
                      {about.profileImage && <AvatarImage src={about.profileImage} alt={about.name || 'Profile Image'} className="object-cover" />}
                      <AvatarFallback>{about.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
                      {about.name}
                    </h1>
                    {about.tagline && <p className="mt-2 text-xl text-muted-foreground font-medium">{about.tagline}</p>}
                    <div className="mt-6 max-w-2xl text-balance">
                      <SlateViewer value={about.bio} />
                    </div>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <Button asChild size="lg">
                        <a href={about.resumeUrl || '#'} download>
                          <Download />
                          Download Resume
                        </a>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="#contact">
                            <Mail />
                            Contact Me
                        </Link>
                      </Button>
                    </div>
                </div>
            )}
        </PreviewWrapper>
    );
}


export function SkillsPreview({ skills }: { skills: Client<Skill>[] }) {
    return (
        <PreviewWrapper title="Skills">
            {skills.length === 0 ? (
                <PreviewPlaceholder sectionName="Skills" />
            ) : (
                <div className="flex flex-wrap justify-center gap-4">
                    {skills.map((skill) => (
                        <SkillHexagon key={skill._id} skill={skill} />
                    ))}
                </div>
            )}
        </PreviewWrapper>
    );
}

export function ProjectsPreview({ projects }: { projects: Client<Project>[] }) {
    return (
        <PreviewWrapper title="Projects">
            {projects.length === 0 ? (
                <PreviewPlaceholder sectionName="Projects" />
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project._id} project={project as any} />
                    ))}
                </div>
            )}
        </PreviewWrapper>
    );
}


export function AchievementsPreview({ achievements, certifications }: { achievements: Client<Achievement>[], certifications: Client<Certification>[] }) {
     if (achievements.length === 0 && certifications.length === 0) {
        return (
            <PreviewWrapper title="Achievements & Certifications">
                <PreviewPlaceholder sectionName="Achievements & Certifications" />
            </PreviewWrapper>
        );
    }
    
    return (
        <PreviewWrapper title="Achievements & Certifications">
            <Tabs defaultValue="achievements" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mx-auto max-w-sm">
                    <TabsTrigger value="achievements" disabled={achievements.length === 0}>Achievements</TabsTrigger>
                    <TabsTrigger value="certifications" disabled={certifications.length === 0}>Certifications</TabsTrigger>
                </TabsList>
                <TabsContent value="achievements">
                    {achievements.length > 0 ? (
                        <Carousel
                          opts={{ align: "start", loop: true }}
                          autoplay
                          className="w-full max-w-xs sm:max-w-md mx-auto"
                        >
                          <CarouselContent>
                            {achievements.map((achievement) => (
                              <CarouselItem key={achievement._id} className="sm:basis-1/2">
                                <div className="p-1 h-full">
                                  <Card className="transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                                    <CardHeader>
                                      <div className="aspect-video relative border rounded-md overflow-hidden">
                                        <Image src={achievement.image || 'https://placehold.co/600x400.png'} alt={achievement.title} fill className="object-cover" data-ai-hint={achievement.imageAiHint || 'award'} />
                                      </div>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                                      <div className="mt-1 text-sm text-card-foreground/80">
                                        <SlateViewer value={achievement.description} />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                    ) : <PreviewPlaceholder sectionName="Achievements" />}
                </TabsContent>
                <TabsContent value="certifications">
                    {certifications.length > 0 ? (
                         <Carousel
                            opts={{ align: "start", loop: true }}
                            autoplay
                            className="w-full max-w-md mx-auto"
                          >
                          <CarouselContent>
                            {certifications.map((cert) => {
                                const issueDate = cert.date ? new Date(cert.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                }) : 'N/A';
        
                                return (
                                  <CarouselItem key={cert._id}>
                                    <div className="p-1 h-full">
                                      <Card className="transition-all duration-300 hover:shadow-lg h-full flex flex-col">
                                          <div className="flex flex-col sm:flex-row items-center justify-between p-6 gap-6 flex-grow">
                                              <div className="flex-1 space-y-3 text-center sm:text-left">
                                                  <CardTitle className="text-xl">{cert.title}</CardTitle>
                                                  <CardDescription>Issued by: {cert.issuedBy}</CardDescription>
                                                  <p className="text-sm text-muted-foreground">Date of Issue: {issueDate}</p>
                                                  {cert.certificateUrl && (
                                                      <Button asChild variant="outline" size="sm" className="mt-2">
                                                          <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                                                              View Certification
                                                              <ExternalLink className="ml-2 h-4 w-4"/>
                                                          </a>
                                                      </Button>
                                                  )}
                                              </div>
                                              <div className="relative h-24 w-24 flex-shrink-0">
                                                  <Image
                                                      src={cert.image || 'https://placehold.co/150x150.png'}
                                                      alt={cert.title}
                                                      fill
                                                      className="object-contain rounded-md"
                                                      data-ai-hint={cert.imageAiHint || 'certificate logo'}
                                                  />
                                              </div>
                                          </div>
                                      </Card>
                                    </div>
                                  </CarouselItem>
                                );
                            })}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                    ) : <PreviewPlaceholder sectionName="Certifications" />}
                </TabsContent>
            </Tabs>
        </PreviewWrapper>
    );
}

export function EducationPreview({ education }: { education: Client<Education>[] }) {
    return (
        <PreviewWrapper title="Education">
            {education.length === 0 ? (
                 <PreviewPlaceholder sectionName="Education" />
            ) : (
                <div className="max-w-3xl mx-auto">
                    <div className="relative space-y-12 py-4">
                        <div className="absolute left-9 top-0 h-full w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>
                        {education.map((edu) => (
                            <div key={edu._id} className="relative">
                                <div className="absolute left-9 top-2 h-4 w-4 rounded-full bg-primary border-4 border-background -translate-x-1/2" aria-hidden="true"></div>
                                <div className="pl-20 flex items-start gap-6">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <Image
                                            src={edu.icon || 'https://placehold.co/100x100.png'}
                                            alt={edu.collegeName}
                                            fill
                                            className="object-contain rounded-md"
                                            data-ai-hint={edu.iconHint || 'university logo'}
                                        />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="text-lg font-bold">{edu.collegeName}</h3>
                                      <p className="font-medium">{edu.degreeName}</p>
                                      <p className="mt-1 text-muted-foreground">{edu.cgpa}</p>
                                      <p className="mt-2 text-sm font-semibold text-primary">{edu.period}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </PreviewWrapper>
    );
}


export function WorkExperiencePreview({ workExperience }: { workExperience: Client<WorkExperience>[] }) {
    return (
        <PreviewWrapper title="Work Experience">
            {workExperience.length === 0 ? (
                <PreviewPlaceholder sectionName="Work Experience" />
            ) : (
                <div className="max-w-4xl mx-auto space-y-8">
                    {workExperience.map((exp) => (
                      <Card key={exp._id} className="flex flex-col sm:flex-row items-start gap-6 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        <div className="relative h-16 w-16 flex-shrink-0 self-center sm:self-start">
                           {exp.icon ? (
                            <Image 
                                src={exp.icon} 
                                alt={exp.companyName} 
                                fill 
                                className="rounded-full object-contain p-1" 
                                data-ai-hint={exp.iconHint || 'company logo'} 
                            />
                            ) : (
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-secondary">
                                <Briefcase className="h-8 w-8 text-secondary-foreground" />
                            </span>
                            )}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl">{exp.role}</CardTitle>
                          <CardDescription className="mt-1">{exp.companyName}</CardDescription>
                          <div className="mt-4 text-sm text-muted-foreground">
                            <SlateViewer value={exp.description} />
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
            )}
        </PreviewWrapper>
    );
}

// For Profile Links, we can show a preview of the footer where they appear
export function ProfileLinksPreview({ profileLinks, about }: { profileLinks: Client<ProfileLink>[], about: Client<About> | null }) {
    return (
        <PreviewWrapper title="Profile Links (in Footer)">
            {profileLinks.length === 0 ? (
                <PreviewPlaceholder sectionName="Profile Links" />
            ) : (
                <footer className="border-t border-border/40 py-6 bg-background">
                    <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} {about?.name || 'Siddhant Gujrathi'}. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-2">
                          {profileLinks.map((link) => (
                             <Button key={link._id} variant="ghost" size="icon" asChild>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                                    <div className="relative h-5 w-5">
                                        <Image src={link.icon || 'https://placehold.co/100x100.png'} alt={link.platform} fill className="object-contain" data-ai-hint={link.iconHint || 'logo'} />
                                    </div>
                                </a>
                           </Button>
                          ))}
                        </div>
                    </div>
                </footer>
            )}
        </PreviewWrapper>
    );
}



    

    







