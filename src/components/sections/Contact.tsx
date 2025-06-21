import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAboutCollection } from "@/models/About";

export async function Contact() {
  const aboutCollection = await getAboutCollection();
  const about = await aboutCollection.findOne({});

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
    </div>
  );
}
