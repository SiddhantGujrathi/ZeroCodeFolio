
'use client';

import type { ComponentProps } from "react";
import Image from "next/image";
import type { Skill } from "@/models/Skill";
import type { Project } from "@/models/Project";
import type { Achievement } from "@/models/Achievement";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { stringToIconMap } from "@/lib/icon-map";
import { Badge } from "@/components/ui/badge";

type ClientSkill = Omit<Skill, '_id' | 'collection'> & { _id: string };
type ClientProject = Omit<Project, '_id' | 'collection'> & { _id: string };
type ClientAchievement = Omit<Achievement, '_id' | 'collection'> & { _id: string };


function DynamicIcon({ name, ...props }: { name: string } & ComponentProps<"svg">) {
  const Icon = stringToIconMap[name];
  if (!Icon) {
    return null;
  }
  return <Icon {...props} />;
}

export function SkillsDisplay({ skills }: { skills: ClientSkill[] }) {
    if (skills.length === 0) {
        return <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>;
    }

    return (
        <div className="space-y-4">
             <h3 className="text-xl font-bold tracking-tight">Current Skills</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map(skill => (
                    <Card key={skill._id} className="p-4 flex flex-col items-center justify-center text-center">
                        <DynamicIcon name={skill.icon} className="h-10 w-10 text-primary" />
                        <p className="mt-2 font-semibold text-sm">{skill.name}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export function ProjectsDisplay({ projects }: { projects: ClientProject[] }) {
    if (projects.length === 0) {
        return <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>;
    }
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Current Projects</h3>
            <div className="grid md:grid-cols-2 gap-6">
                {projects.map(project => (
                    <Card key={project._id} className="overflow-hidden">
                        <CardHeader className="p-0">
                            <div className="aspect-video overflow-hidden border-b">
                                <Image src={project.image} alt={project.title} width={400} height={250} className="w-full h-full object-cover" />
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
        </div>
    );
}

export function AchievementsDisplay({ achievements }: { achievements: ClientAchievement[] }) {
     if (achievements.length === 0) {
        return <p className="text-muted-foreground text-center py-4">Nothing is added yet.</p>;
    }
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">Current Achievements</h3>
             <div className="space-y-2">
                {achievements.map(achievement => (
                    <Card key={achievement._id}>
                        <CardHeader>
                            <CardTitle className="text-base">{achievement.title}</CardTitle>
                            <CardDescription className="text-sm">{achievement.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    );
}
