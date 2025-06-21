import Image from "next/image";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { getEducationCollection } from "@/models/Education";

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
        <div className="mt-12 space-y-8">
          {educations.map((edu) => (
            <Card key={edu._id.toString()} className="flex flex-col sm:flex-row items-center p-6 gap-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="relative h-20 w-20 flex-shrink-0">
                  <Image src={edu.icon || 'https://placehold.co/400x400.png'} alt={edu.collegeName} fill className="object-contain rounded-full" data-ai-hint={edu.iconHint || 'university logo'} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                  <CardTitle className="text-xl">{edu.degreeName}</CardTitle>
                  <CardDescription className="mt-1">{edu.collegeName}</CardDescription>
                  <p className="mt-2 text-sm text-muted-foreground">{edu.period} | CGPA: {edu.cgpa}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
