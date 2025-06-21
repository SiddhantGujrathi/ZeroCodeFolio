import type { LucideIcon } from "lucide-react";
import { Github, ExternalLink, GitBranch, Linkedin, Twitter, Mail, Database, RefreshCw, CloudCog, GitFork } from "lucide-react";
import { 
    CppIcon, 
    GitIcon, 
    JavaIcon, 
    JavascriptIcon, 
    NextjsIcon, 
    NodejsIcon, 
    PythonIcon, 
    ReactIcon, 
    TailwindcssIcon, 
    TypescriptIcon,
    Html5Icon,
    Css3Icon,
    BootstrapIcon,
    AndroidIcon,
    SpringIcon,
    DockerIcon,
    PostmanIcon,
    MongoDbIcon,
    PostgreSqlIcon,
    MavenIcon
} from "@/components/icons";

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
  Html5Icon,
  Css3Icon,
  BootstrapIcon,
  AndroidIcon,
  SpringIcon,
  DockerIcon,
  PostmanIcon,
  MongoDbIcon,
  PostgreSqlIcon,
  MavenIcon,

  // Lucide Icons mapped to custom names
  DatabaseIcon: Database,
  MySqlIcon: Database,
  AgileIcon: RefreshCw,
  RestApiIcon: CloudCog,
  MultithreadingIcon: GitFork,
  CiCdIcon: Github,

  // Direct Lucide Icons
  GitBranch,
  Github,
  ExternalLink,
  Linkedin,
  Twitter,
  Mail,
};
