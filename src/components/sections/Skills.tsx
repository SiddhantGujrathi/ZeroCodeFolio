import type { ComponentProps } from "react";
import { Card } from "@/components/ui/card";
import { getSkillsCollection } from "@/models/Skill";
import { stringToIconMap } from "@/lib/icon-map";

function DynamicIcon({ name, ...props }: { name: string } & ComponentProps<"svg">) {
  const Icon = stringToIconMap[name];
  if (!Icon) {
    return null;
  }
  return <Icon {...props} />;
}

export async function Skills() {
  const skillsCollection = await getSkillsCollection();
  const skills = await skillsCollection.find({}).toArray();

  if (skills.length === 0) {
    return null;
  }
  
  return (
    <section id="skills" className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            My Technical Skills
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A snapshot of the technologies and tools I work with.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {skills.map((skill) => (
            <Card key={skill._id.toString()} className="flex flex-col items-center justify-center p-4 text-center transition-transform hover:scale-105 hover:shadow-lg">
              <DynamicIcon name={skill.icon} className="h-12 w-12 text-primary" />
              <p className="mt-4 font-semibold">{skill.name}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
