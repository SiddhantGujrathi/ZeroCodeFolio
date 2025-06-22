// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import Image from "next/image";
import { Briefcase } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { getWorkExperienceCollection } from "@/models/WorkExperience";
import { SlateViewer } from "../admin/SlateViewer";


export async function WorkExperience() {
  const workExperienceCollection = await getWorkExperienceCollection();
  const experiences = await workExperienceCollection.find({}).sort({ _id: -1 }).toArray();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-headline flex items-center justify-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="rounded-lg bg-primary/10 p-3 text-primary">
            <Briefcase className="h-6 w-6" />
          </span>
          Work Experience
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My professional journey and key roles.
        </p>
      </div>
      <div className="mt-12 max-w-4xl mx-auto space-y-8">
        {experiences.map((exp) => (
          <Card key={exp._id.toString()} className="flex flex-col sm:flex-row items-start gap-6 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative h-16 w-16 flex-shrink-0 self-center sm:self-start">
              {exp.icon && typeof exp.icon === 'string' ? (
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
    </div>
  );
}
