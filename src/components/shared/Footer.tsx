import { getProfileLinksCollection } from "@/models/ProfileLink";
import { getAboutCollection } from "@/models/About";
import { Button } from "@/components/ui/button";
import { stringToIconMap } from "@/lib/icon-map";
import { ComponentProps } from "react";
import { Globe } from "lucide-react";


function DynamicIcon({ name, ...props }: { name: string } & ComponentProps<"svg">) {
  const Icon = stringToIconMap[name] || Globe;
  return <Icon {...props} />;
}

export async function Footer() {
    const profileLinksCollection = await getProfileLinksCollection();
    const links = await profileLinksCollection.find({}).toArray();

    const aboutCollection = await getAboutCollection();
    const about = await aboutCollection.findOne({});
  
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {about?.name || 'Siddhant Gujrathi'}. All rights reserved.
        </p>
        <div className="flex items-center space-x-2">
          {links.map((link) => (
             <Button key={link.platform} variant="ghost" size="icon" asChild>
             <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform}>
               <DynamicIcon name={link.icon} className="h-5 w-5" />
             </a>
           </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
