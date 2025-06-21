import { SOCIAL_LINKS } from "@/lib/data";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siddhant Gujrathi. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
          {SOCIAL_LINKS.map((link) => (
             <Button key={link.name} variant="ghost" size="icon" asChild>
             <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
               <link.icon className="h-5 w-5" />
             </a>
           </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
