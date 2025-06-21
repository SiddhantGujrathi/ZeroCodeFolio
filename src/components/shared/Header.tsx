
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code, Menu, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

interface NavLink {
    name: string;
    href: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Achievements", href: "#achievements" },
  { name: "Contact", href: "#contact" },
];


interface HeaderProps {
    navLinks?: NavLink[];
}

export function Header({ navLinks = DEFAULT_NAV_LINKS }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
        const offset = 100;
        const scrollY = window.scrollY;

        const allSections = navLinks
            .map(link => document.getElementById(link.href.substring(1)))
            .filter(Boolean) as HTMLElement[];
        
        const sortedSections = allSections.sort((a, b) => a.offsetTop - b.offsetTop);

        let currentActive = '';
        for (const section of sortedSections) {
            if (section.offsetTop <= scrollY + offset) {
                currentActive = `#${section.id}`;
            } else {
                break;
            }
        }
        
        if (window.innerHeight + scrollY >= document.body.scrollHeight - 50) {
           const lastSection = sortedSections[sortedSections.length - 1];
           if (lastSection) {
               currentActive = `#${lastSection.id}`;
           }
        }
        
        setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, [navLinks]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Code className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              Siddhant Gujrathi
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  activeSection === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Code className="h-6 w-6 text-primary" />
              <span className="font-bold">Siddhant Gujrathi</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "transition-colors hover:text-primary",
                      activeSection === link.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="flex items-center space-x-2 md:hidden">
            <Code className="h-6 w-6 text-primary" />
            <span className="font-bold">S. Gujrathi</span>
        </Link>


        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon">
              <Link href="/login">
                <User />
                <span className="sr-only">Admin Login</span>
              </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
