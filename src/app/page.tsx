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

const sectionComponents: { [key: string]: React.ComponentType<any> } = {
  Hero,
  Skills,
  WorkExperience,
  Projects,
  Education,
  Achievements,
  Contact,
};


export default async function Home() {
  const layout = await getLayout();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header navLinks={layout.navLinks} />
      <main className="flex-1">
        {layout.sections.map((sectionName) => {
          const SectionComponent = sectionComponents[sectionName];
          return SectionComponent ? <SectionComponent key={sectionName} /> : null;
        })}
      </main>
      <Footer />
    </div>
  );
}
