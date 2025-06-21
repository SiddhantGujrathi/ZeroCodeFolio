// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type { Collection, Document, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export interface NavLink {
    name: string;
    href: string;
}

export interface Layout extends Document {
  _id?: ObjectId;
  navLinks: NavLink[];
  sections: string[];
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Education", href: "#education" },
    { name: "Achievements", href: "#achievements" },
    { name: "Contact", href: "#contact" },
];

export const DEFAULT_SECTIONS: string[] = [
    'About', 'Skills', 'WorkExperience', 'Projects', 'Education', 'Achievements', 'Contact'
];

export async function getLayoutCollection(): Promise<Collection<Layout>> {
  const client = await clientPromise;
  const db = client.db('portfolio');
  return db.collection<Layout>('layout');
}

export async function getLayout(): Promise<Layout> {
    try {
        const layoutCollection = await getLayoutCollection();
        const layout = await layoutCollection.findOne({});
        if (layout) {
            // Ensure both properties exist, falling back to defaults if they don't
            const finalLayout = { ...layout };
            if (!finalLayout.navLinks) finalLayout.navLinks = DEFAULT_NAV_LINKS;
            if (!finalLayout.sections) finalLayout.sections = DEFAULT_SECTIONS;
            return finalLayout as Layout;
        }
    } catch (e) {
        console.error("Failed to fetch layout, returning default. Error:", e);
    }
    
    return {
        navLinks: DEFAULT_NAV_LINKS,
        sections: DEFAULT_SECTIONS,
    } as Layout;
}
