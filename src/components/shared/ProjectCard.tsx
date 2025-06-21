import Image from "next/image";
import type { LucideIcon } from "lucide-react";
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

type ProjectLink = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type ProjectCardProps = {
  title: string;
  description: string;
  image: string;
  imageAiHint: string;
  tags: string[];
  links: ProjectLink[];
};

export function ProjectCard({
  title,
  description,
  image,
  imageAiHint,
  tags,
  links,
}: ProjectCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-xl">
      <CardHeader>
        <div className="aspect-video overflow-hidden rounded-md border">
          <Image
            src={image}
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
          {links.map((link) => (
            <Button key={link.name} asChild variant={link.name === 'GitHub' ? "outline" : "default"}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <link.icon className="mr-2 h-4 w-4" />
                {link.name}
              </a>
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
