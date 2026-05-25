"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBrandGithub,
  IconBolt,
  IconMenu2,
  IconX,
  IconGitBranch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavLink = {
  href: string;
  label: string;
  isPage?: boolean;
  highlight?: boolean;
  hideLg?: boolean;
};

const navLinks: NavLink[] = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/instructions", label: "Docs", isPage: true },
  { href: "#generator", label: "Studio", highlight: true },
  { href: "#roadmap", label: "Roadmap", hideLg: true },
  { href: "#creator", label: "Creator", hideLg: true },
];

function resolveHref(href: string, isPage?: boolean) {
  if (isPage || href.startsWith("http")) return href;
  if (href.startsWith("#")) return `/${href}`;
  return href;
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
          onClick={closeMobile}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/20">
            <IconGitBranch className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight sm:text-base">
              Pipeline Forge
            </span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">
              CI/CD generator
            </span>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const href = resolveHref(link.href, link.isPage);
            const isActive = link.isPage && pathname === link.href;

            return (
              <Link
                key={link.href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  link.highlight
                    ? "text-primary hover:bg-primary/10"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                  link.hideLg && "hidden lg:inline-flex"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <a
            href="https://github.com/NotHarshhaa/pipeline-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
            aria-label="GitHub repository"
          >
            <Button variant="outline" size="sm" className="h-9 gap-1.5 px-3">
              <IconBrandGithub className="h-4 w-4" />
              <span className="hidden lg:inline">GitHub</span>
            </Button>
          </a>

          <Button size="sm" className="hidden h-9 gap-1.5 font-semibold md:inline-flex" asChild>
            <Link href="/#generator">
              <IconBolt className="h-4 w-4" />
              <span className="hidden lg:inline">Open Studio</span>
              <span className="lg:hidden">Studio</span>
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/50 text-foreground transition-colors hover:bg-muted md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <IconX className="h-5 w-5" />
            ) : (
              <IconMenu2 className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur-lg md:hidden">
          <nav
            className="mx-auto max-w-7xl space-y-1 px-4 py-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => {
              const href = resolveHref(link.href, link.isPage);
              const isActive = link.isPage && pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={href}
                  onClick={closeMobile}
                  className={cn(
                    "flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    link.highlight
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted text-foreground"
                  )}
                >
                  {link.highlight && (
                    <IconBolt className="mr-2 h-4 w-4 shrink-0" />
                  )}
                  {link.label}
                </Link>
              );
            })}

            <div className="grid grid-cols-2 gap-2 pt-3">
              <a
                href="https://github.com/NotHarshhaa/pipeline-forge"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
              >
                <Button variant="outline" size="sm" className="h-10 w-full gap-2">
                  <IconBrandGithub className="h-4 w-4" />
                  GitHub
                </Button>
              </a>
              <Button size="sm" className="h-10 w-full gap-2 font-semibold" asChild>
                <Link href="/#generator" onClick={closeMobile}>
                  <IconBolt className="h-4 w-4" />
                  Open Studio
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
