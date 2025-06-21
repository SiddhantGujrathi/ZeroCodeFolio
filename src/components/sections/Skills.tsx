import React from 'react';
import { getSkillsCollection } from "@/models/Skill";
import { Shapes } from "lucide-react";
import { SkillHexagon } from '../shared/SkillHexagon';

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
      <div className="mt-12 flex flex-wrap justify-center gap-4">
        {skills.map((skill) => (
          <SkillHexagon key={skill._id.toString()} skill={skill} />
        ))}
      </div>
    </div>
  );
}
