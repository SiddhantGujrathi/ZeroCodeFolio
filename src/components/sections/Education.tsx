// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import Image from "next/image";
import { getEducationCollection } from "@/models/Education";
import { BookOpenCheck } from "lucide-react";

export async function Education() {
  const educationCollection = await getEducationCollection();
  const educations = await educationCollection.find({}).sort({ _id: -1 }).toArray();

  if (educations.length === 0) {
    return null;
  }

  return (
    <div className="container">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-headline flex items-center justify-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
          <span className="rounded-lg bg-primary/10 p-3 text-primary">
            <BookOpenCheck className="h-6 w-6" />
          </span>
          Education
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          My academic background and qualifications.
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-9 top-0 h-full w-0.5 bg-border -translate-x-1/2" aria-hidden="true"></div>

          {educations.map((edu) => (
            <div key={edu._id.toString()} className="relative">
              {/* Timeline Dot */}
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
    </div>
  );
}
