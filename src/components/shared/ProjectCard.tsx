'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/models/Project";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SlateViewer } from "@/components/admin/SlateViewer";
import { cn } from "@/lib/utils";


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

  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const checkClamp = useCallback(() => {
    if (descriptionRef.current) {
      // Temporarily un-clamp to measure full scrollHeight
      descriptionRef.current.classList.remove('line-clamp-3');
      const isClamped = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      // Re-apply clamp if not expanded
      if (!isExpanded) {
        descriptionRef.current.classList.add('line-clamp-3');
      }
       // Need to measure again after re-clamping to get correct clientHeight
      setShowReadMore(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
    }
  }, [isExpanded]);

  useEffect(() => {
    const check = () => {
        if (descriptionRef.current) {
            const hasClampClass = descriptionRef.current.classList.contains('line-clamp-3');
            if (hasClampClass) {
                 setShowReadMore(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
            }
        }
    }
    // A slight delay is needed for the DOM to settle, especially on initial load.
    const timeoutId = setTimeout(() => {
        check();
        window.addEventListener('resize', check);
    }, 100);

    return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', check);
    }
  }, [project.description, isExpanded]);


  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="aspect-video overflow-hidden rounded-md border">
          <Image
            src={projectImage || 'https://placehold.co/600x400.png'}
            alt={title}
            width={600}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={imageAiHint || 'project image'}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <div className="mt-2 text-balance">
            <div ref={descriptionRef} className={cn(!isExpanded && "line-clamp-3")}>
                <SlateViewer value={description} />
            </div>
            {showReadMore && (
              <Button 
                variant="link" 
                className="px-0 h-auto py-1 text-sm text-primary" 
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Read More"}
              </Button>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-2">
          {websiteUrl && (
            <Button asChild>
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Website
              </a>
            </Button>
          )}
          {githubUrl && (
            <Button asChild variant="outline">
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}