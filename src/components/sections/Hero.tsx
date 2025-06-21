// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import Link from "next/link";
import Image from "next/image";
import { Download, Mail } from "lucide-react";

import { getAboutCollection } from "@/models/About";
import { getProfileLinksCollection } from "@/models/ProfileLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SlateViewer } from "../admin/SlateViewer";


export async function Hero() {
  const aboutCollection = await getAboutCollection();
  const about = await aboutCollection.findOne({});

  const profileLinksCollection = await getProfileLinksCollection();
  const links = await profileLinksCollection.find({}).toArray();

  if (!about) {
    return (
      <p>About section not configured yet.</p>
    );
  }

  return (
    <>
        <Avatar className="h-40 w-40 border-4 border-primary">
          {about.profileImage && <AvatarImage src={about.profileImage} alt={about.name} className="object-cover" />}
          <AvatarFallback>{about.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
          {about.name}
        </h1>
        {about.tagline && <p className="mt-2 text-xl text-muted-foreground font-medium">{about.tagline}</p>}
        <div className="mt-6 max-w-2xl text-balance">
          <SlateViewer value={about.bio} />
        </div>
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <a href={about.resumeUrl || '#'} download>
                  <Download />
                  Download Resume
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#contact">
                  <Mail />
                  Contact Me
                </Link>
              </Button>
            </div>
            
            {links.length > 0 && (
              <div className="mt-4 flex items-center justify-center space-x-2">
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
    </>
  );
}
