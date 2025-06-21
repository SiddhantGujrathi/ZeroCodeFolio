import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAboutCollection } from "@/models/About";
import { getProfileLinksCollection } from "@/models/ProfileLink";
import Image from "next/image";

export async function Contact() {
  const aboutCollection = await getAboutCollection();
  const about = await aboutCollection.findOne({});

  const profileLinksCollection = await getProfileLinksCollection();
  const links = await profileLinksCollection.find({}).toArray();

  return (
    <div className="container">
      <h2 className="font-headline flex items-center justify-center gap-4 text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="rounded-lg bg-primary/10 p-3 text-primary">
          <Mail className="h-6 w-6" />
        </span>
        Get In Touch
      </h2>
      <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
        I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Feel free to reach out.
      </p>
      <div className="mt-8">
        <Button asChild size="lg">
          <a href={`mailto:${about?.email || 'your-email@example.com'}`}>
            <Mail />
            Say Hello
          </a>
        </Button>
      </div>

      {links.length > 0 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          {links.map((link) => (
             <Button key={link._id.toString()} variant="ghost" size="icon" className="h-12 w-12" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    <div className="relative h-6 w-6">
                        <Image src={link.icon || 'https://placehold.co/100x100.png'} alt={link.platform} fill className="object-contain" data-ai-hint={link.iconHint || 'logo'} />
                    </div>
                </a>
           </Button>
          ))}
        </div>
      )}
    </div>
  );
}
