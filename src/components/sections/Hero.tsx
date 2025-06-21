import Link from "next/link";
import { Download } from "lucide-react";

import { SOCIAL_LINKS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Hero() {
  return (
    <section id="about" className="container flex flex-col items-center justify-center py-20 text-center md:py-32">
        <Avatar className="h-28 w-28 border-2 border-primary">
          <AvatarImage src="https://avatars.githubusercontent.com/u/79981854?v=4" alt="Siddhant Gujrathi" />
          <AvatarFallback>SG</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
          Siddhant Gujrathi
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Full Stack Software Developer
        </p>
        <p className="mt-6 max-w-2xl text-balance">
          A passionate Full Stack Software Developer with a knack for creating elegant and efficient solutions. I thrive on turning complex problems into simple, beautiful, and intuitive designs.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <a href="/Siddhant_Gujrathi_Resume.pdf" download>
              <Download className="mr-2 h-5 w-5" />
              Download Resume
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
             <Link href="#contact">Contact Me</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center space-x-4">
          {SOCIAL_LINKS.map((link) => (
             <Button key={link.name} variant="ghost" size="icon" asChild>
             <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
               <link.icon className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
             </a>
           </Button>
          ))}
        </div>
    </section>
  );
}
