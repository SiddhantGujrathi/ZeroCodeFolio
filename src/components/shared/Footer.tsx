import { getProfileLinksCollection } from "@/models/ProfileLink";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export async function Footer() {
    const profileLinksCollection = await getProfileLinksCollection();
    const links = await profileLinksCollection.find({}).toArray();

  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Siddhant Gujrathi. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
          {links.map((link) => (
             <Button key={link._id.toString()} variant="ghost" size="icon" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
                    <div className="relative h-5 w-5">
                        <Image src={link.icon || 'https://placehold.co/100x100.png'} alt={link.platform} fill className="object-contain" data-ai-hint={link.iconHint || 'logo'} />
                    </div>
                </a>
           </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
