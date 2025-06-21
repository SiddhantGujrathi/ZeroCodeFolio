import Link from "next/link";
import Image from "next/image";
import { Download, Mail } from "lucide-react";

import { getAboutCollection } from "@/models/About";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SlateViewer } from "../admin/SlateViewer";


export async function Hero() {
  const aboutCollection = await getAboutCollection();
  const about = await aboutCollection.findOne({});

  if (!about) {
    return (
      <p>About section not configured yet.</p>
    );
  }

  return (
    <>
        <Avatar className="h-40 w-40 border-4 border-primary">
          {about.profileImage && <AvatarImage src={about.profileImage} alt={about.name} />}
          <AvatarFallback>{about.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="mt-4 font-headline text-4xl font-bold tracking-tight md:text-6xl">
          {about.name}
        </h1>
        {about.tagline && <p className="mt-2 text-xl text-muted-foreground font-medium">{about.tagline}</p>}
        <div className="mt-6 max-w-2xl text-balance">
          <SlateViewer value={about.bio} />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
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
    </>
  );
}
