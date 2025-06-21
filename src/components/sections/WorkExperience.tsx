import Image from "next/image";
import { Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWorkExperienceCollection } from "@/models/WorkExperience";


export async function WorkExperience() {
  const workExperienceCollection = await getWorkExperienceCollection();
  const experiences = await workExperienceCollection.find({}).sort({ _id: -1 }).toArray();

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="bg-muted/50 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Work Experience
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My professional journey and key roles.
          </p>
        </div>
        <div className="relative mt-12">
           <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-px bg-border" aria-hidden="true" />
           <div className="space-y-12">
            {experiences.map((exp, index) => (
                <div key={exp._id.toString()} className="relative flex items-start">
                    <div className="absolute left-1/2 top-6 -translate-x-1/2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground relative overflow-hidden">
                           {exp.icon ? (
                               <Image src={exp.icon} alt={exp.companyName} fill className="object-contain p-1" data-ai-hint={exp.iconHint || 'company logo'} />
                           ) : (
                               <Briefcase className="h-5 w-5" />
                           )}
                        </span>
                    </div>
                    <Card className={`w-[calc(50%-2rem)] ${index % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                        <CardHeader>
                            <CardTitle>{exp.role}</CardTitle>
                            <CardDescription>{exp.companyName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{exp.description}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
           </div>
        </div>
      </div>
    </section>
  );
}
