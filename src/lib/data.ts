import { Github, Linkedin, Mail, Twitter, GitBranch, Link as LinkIcon, ExternalLink } from "lucide-react";
import { CppIcon, GitIcon, JavaIcon, JavascriptIcon, NextjsIcon, NodejsIcon, PythonIcon, ReactIcon, TailwindcssIcon, TypescriptIcon } from "@/components/icons";

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/Siddhant-Gujrathi",
    icon: Github,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/siddhant-gujrathi/",
    icon: Linkedin,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/SiddhantGujrat1",
    icon: Twitter,
  },
  {
    name: "Email",
    url: "mailto:siddhant.gujrathi@gmail.com",
    icon: Mail,
  },
];

export const SKILLS = [
  { name: "JavaScript", icon: JavascriptIcon },
  { name: "TypeScript", icon: TypescriptIcon },
  { name: "Python", icon: PythonIcon },
  { name: "Java", icon: JavaIcon },
  { name: "C++", icon: CppIcon },
  { name: "React", icon: ReactIcon },
  { name: "Next.js", icon: NextjsIcon },
  { name: "Node.js", icon: NodejsIcon },
  { name: "Tailwind CSS", icon: TailwindcssIcon },
  { name: "Git", icon: GitIcon },
  { name: "Databases", icon: GitBranch },
  { name: "DevOps", icon: GitBranch },
];

export const PROJECTS = [
  {
    title: "Portfolio Website",
    description: "My personal portfolio website to showcase my skills, projects, and experiences. Built with Next.js and Tailwind CSS, it's a testament to my front-end development capabilities.",
    image: "https://placehold.co/600x400.png",
    imageAiHint: "portfolio website",
    tags: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    links: [
      { name: "Website", url: "#", icon: ExternalLink },
      { name: "GitHub", url: "https://github.com/Siddhant-Gujrathi/Portfolio-Website", icon: Github },
    ],
  },
  {
    title: "Algo-Visualizer",
    description: "An interactive platform that visualizes various sorting and searching algorithms. It's a great tool for learning and understanding how algorithms work.",
    image: "https://placehold.co/600x400.png",
    imageAiHint: "algorithm visualization",
    tags: ["React", "JavaScript", "HTML/CSS"],
    links: [
      { name: "Website", url: "https://siddhant-gujrathi.github.io/Algo-visualizer/", icon: ExternalLink },
      { name: "GitHub", url: "https://github.com/Siddhant-Gujrathi/Algo-visualizer", icon: Github },
    ],
  },
  {
    title: "Issue-Tracker",
    description: "A web application for tracking issues and bugs in projects. It allows users to create, update, and manage issues, with features like filtering and user assignment.",
    image: "https://placehold.co/600x400.png",
    imageAiHint: "issue tracker",
    tags: ["Node.js", "Express", "EJS", "MongoDB"],
    links: [
      { name: "GitHub", url: "https://github.com/Siddhant-Gujrathi/Issue-tracker", icon: Github },
    ],
  },
];

export const ACHIEVEMENTS = [
  {
    title: "Solved 800+ Problems on LeetCode",
    description: "Consistently practiced and solved a wide range of algorithmic problems, enhancing problem-solving skills and understanding of data structures.",
  },
  {
    title: "5-Star Coder on HackerRank (Problem Solving)",
    description: "Achieved a top-tier rating in problem-solving challenges, demonstrating proficiency in competitive programming.",
  },
  {
    title: "Specialist on Codeforces",
    description: "Reached the 'Specialist' rank in competitive programming contests, indicating strong performance against global competitors.",
  },
];
