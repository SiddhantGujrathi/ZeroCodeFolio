import type { ComponentProps } from "react";
import { GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getEducationCollection } from "@/models/Education";
import { stringToIconMap } from "@/lib/icon-map";

function DynamicIcon({ name, ...props }: { name: string } & ComponentProps<"svg">) {
  const Icon = stringToIconMap[name] || GraduationCap;
  return <Icon {...props} />;
}

export async function Education() {
  const educationCollection = await getEducationCollection();
  const educations = await educationCollection.find({}).sort({ _id: -1 }).toArray();

  if (educations.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Education
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            My academic background and qualifications.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {educations.map((edu) => (
            <Card key={edu._id.toString()} className="flex">
              <div className="p-6 flex items-center justify-center">
                  <DynamicIcon name={edu.icon} className="h-10 w-10 text-primary" />
              </div>
              <div className="p-6 pl-0 flex-1">
                  <CardTitle className="text-lg">{edu.degreeName}</CardTitle>
                  <CardDescription className="mt-1">{edu.collegeName}</CardDescription>
                  <p className="mt-2 text-sm text-muted-foreground">{edu.period}</p>
                  <p className="text-sm text-muted-foreground">CGPA: {edu.cgpa}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
