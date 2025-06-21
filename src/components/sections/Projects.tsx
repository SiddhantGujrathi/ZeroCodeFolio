import { ProjectCard } from "@/components/shared/ProjectCard";
import { getProjectsCollection } from "@/models/Project";
import type { Project } from "@/models/Project";

export async function Projects() {
  const projectsCollection = await getProjectsCollection();
  const projectsFromDb = await projectsCollection.find({}).sort({ createdAt: -1 }).toArray();

  if (projectsFromDb.length === 0) {
    return null;
  }

  const projects = projectsFromDb.map(p => ({
    ...p,
    _id: p._id.toString(),
  })) as (Project & { _id: string })[];


  return (
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
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}