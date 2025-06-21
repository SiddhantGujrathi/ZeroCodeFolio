import type { LucideIcon } from "lucide-react";
import { Github, ExternalLink, GitBranch } from "lucide-react";
import { CppIcon, GitIcon, JavaIcon, JavascriptIcon, NextjsIcon, NodejsIcon, PythonIcon, ReactIcon, TailwindcssIcon, TypescriptIcon } from "@/components/icons";

export const stringToIconMap: Record<string, React.ElementType | LucideIcon> = {
  // Custom Icons
  JavascriptIcon,
  TypescriptIcon,
  PythonIcon,
  JavaIcon,
  CppIcon,
  ReactIcon,
  NextjsIcon,
  NodejsIcon,
  TailwindcssIcon,
  GitIcon,
  // Lucide Icons
  GitBranch,
  Github,
  ExternalLink,
};
