"use client";

import { useState } from "react";
import { IconBrandGithub, IconBolt, IconMenu2, IconX, IconGitBranch } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: Array<{ href: string; label: string; hideOnMd?: boolean }> = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "/instructions", label: "Instructions" },
    { href: "#generator", label: "Generator" },
    { href: "#roadmap", label: "Roadmap", hideOnMd: true },
    { href: "#creator", label: "Creator", hideOnMd: true },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md overflow-x-hidden">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <IconGitBranch className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
            Pipeline Forge
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`hover:text-foreground transition-colors ${link.hideOnMd ? 'hidden lg:inline' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <IconX className="h-5 w-5" />
            ) : (
              <IconMenu2 className="h-5 w-5" />
            )}
          </button>
          <a
            href="https://github.com/NotHarshhaa/pipeline-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:block"
          >
            <Button variant="outline" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <IconBrandGithub className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
          </a>
          <a href="#generator" className="hidden lg:block">
            <Button size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <IconBolt className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Get Started</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Separator className="my-2" />
            <a
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleNavClick}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <IconBrandGithub className="h-4 w-4" />
              View on GitHub
            </a>
            <a
              href="#generator"
              onClick={handleNavClick}
            >
              <Button size="sm" className="w-full gap-2 mt-2">
                <IconBolt className="h-4 w-4" />
                Get Started
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
