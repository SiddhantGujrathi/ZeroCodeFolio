import Image from "next/image";
import React from 'react';
import { Card } from "@/components/ui/card";
import { getSkillsCollection } from "@/models/Skill";
import { Shapes } from "lucide-react";
import { stringToIconMap } from "@/lib/icon-map";

export async function Skills() {
  const skillsCollection = await getSkillsCollection();
  const skills = await skillsCollection.find({}).sort({ order: 1, _id: 1 }).toArray();

  if (skills.length === 0) {
    return null;
  }
  
  return (
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-headline flex items-center justify-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="rounded-lg bg-primary/10 p-3 text-primary">
            <Shapes className="h-6 w-6" />
          </span>
          My Technical Skills
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A snapshot of the technologies and tools I work with.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {skills.map((skill) => (
          <Card key={skill._id.toString()} className="flex flex-col items-center justify-center p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="relative h-16 w-16 flex items-center justify-center">
               {(() => {
                   if (skill.image) {
                       return <Image src={skill.image} alt={skill.title} fill className="object-contain" data-ai-hint={skill.imageAiHint || 'skill icon'} />;
                   }
                   if (skill.icon && stringToIconMap[skill.icon]) {
                       const IconComponent = stringToIconMap[skill.icon];
                       return <IconComponent className="h-12 w-12 text-primary" />;
                   }
                   return <Image src={'https://placehold.co/100x100.png'} alt={skill.title} fill className="object-contain" data-ai-hint={skill.imageAiHint || 'skill icon'} />;
               })()}
            </div>
            <p className="mt-4 font-semibold">{skill.title}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
