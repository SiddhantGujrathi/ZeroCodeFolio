import type { LucideIcon } from "lucide-react";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { getProjectsCollection } from "@/models/Project";
import { stringToIconMap } from "@/lib/icon-map";

export async function Projects() {
  const projectsCollection = await getProjectsCollection();
  const projectsFromDb = await projectsCollection.find({}).sort({ _id: -1 }).toArray();

  if (projectsFromDb.length === 0) {
    return null;
  }

  const projects = projectsFromDb.map(p => ({
    title: p.title,
    description: p.description,
    image: p.image,
    imageAiHint: p.imageAiHint,
    tags: p.tags,
    links: p.links.map(l => ({
        ...l,
        icon: stringToIconMap[l.icon] as LucideIcon
    })),
  }));

  return (
    <section id="projects" className="py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Featured Projects
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here are some of the projects I'm proud of.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
