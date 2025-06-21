import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/models/Project";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProjectCardProps = {
  project: Project & { _id: string };
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { 
    title, 
    description, 
    projectImage, 
    imageAiHint, 
    tags, 
    websiteUrl, 
    githubUrl 
  } = project;

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="aspect-video overflow-hidden rounded-md border">
          <Image
            src={projectImage}
            alt={title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform hover:scale-105"
            data-ai-hint={imageAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <CardDescription className="mt-2 text-balance">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full items-center justify-start gap-2">
          {websiteUrl && (
            <Button asChild>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Website
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button asChild variant="outline">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
