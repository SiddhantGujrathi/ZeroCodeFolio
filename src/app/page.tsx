import { Hero } from "@/components/sections/Hero";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Achievements } from "@/components/sections/Achievements";
import { Contact } from "@/components/sections/Contact";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { Education } from "@/components/sections/Education";
import { getLayout } from "@/models/Layout";
import { MotionWrapper } from "@/components/shared/MotionWrapper";

const sectionConfig: { [key: string]: { component: React.ComponentType<any>, className: string, id: string } } = {
  About: { component: Hero, className: 'container flex flex-col items-center justify-center py-12 text-center md:py-16', id: 'about' },
  Skills: { component: Skills, className: 'bg-muted/50 py-12 md:py-16', id: 'skills' },
  WorkExperience: { component: WorkExperience, className: 'bg-muted/50 py-12 md:py-16', id: 'experience' },
  Projects: { component: Projects, className: 'py-12 md:py-16', id: 'projects' },
  Education: { component: Education, className: 'py-12 md:py-16', id: 'education' },
  Achievements: { component: Achievements, className: 'bg-muted/50 py-12 md:py-16', id: 'achievements' },
  Contact: { component: Contact, className: 'py-12 text-center md:py-16', id: 'contact' },
};


export default async function Home() {
  const layout = await getLayout();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header navLinks={layout.navLinks} />
      <main className="flex-1">
        {layout.sections.map((sectionName) => {
          const config = sectionConfig[sectionName];
          if (!config) return null;
          const SectionComponent = config.component;
          return (
            <MotionWrapper key={sectionName} id={config.id} className={config.className}>
              <SectionComponent />
            </MotionWrapper>
          );
        })}
      </main>
      <Footer />
    </div>
  );
}
