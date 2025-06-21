import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";

import { getAboutCollection } from "@/models/About";
import { getProfileLinksCollection } from "@/models/ProfileLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export async function Hero() {
  const aboutCollection = await getAboutCollection();
  const about = await aboutCollection.findOne({});

  const profileLinksCollection = await getProfileLinksCollection();
  const socialLinks = await profileLinksCollection.find({}).toArray();

  if (!about) {
    return (
      <p>About section not configured yet.</p>
    );
  }

  return (
    <>
        <Avatar className="h-28 w-28 border-2 border-primary">
          {about.profileImage && <AvatarImage src={about.profileImage} alt={about.name} />}
          <AvatarFallback>{about.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
          {about.name}
        </h1>
        <p className="mt-6 max-w-2xl text-balance">
         {about.bio}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <a href={about.resumeUrl} download target="_blank" rel="noopener noreferrer">
              <Download />
              Download Resume
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
             <Link href="#contact">Contact Me</Link>
          </Button>
        </div>
        <div className="mt-8 flex items-center space-x-4">
          {socialLinks.map((link) => (
            <Button key={link._id.toString()} variant="ghost" size="icon" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    <div className="relative h-6 w-6">
                        <Image src={link.icon || 'https://placehold.co/100x100.png'} alt={link.platform} fill className="object-contain" data-ai-hint={link.iconHint || 'logo'} />
                    </div>
                </a>
            </Button>
          ))}
        </div>
    </>
  );
}