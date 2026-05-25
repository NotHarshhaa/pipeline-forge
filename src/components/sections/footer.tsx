import Link from "next/link";
import {
  IconBrandGithub,
  IconHeart,
  IconGitBranch,
  IconBolt,
  IconBook2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#generator", label: "Pipeline Studio" },
  { href: "/#roadmap", label: "Roadmap" },
];

const resourceLinks = [
  { href: "/instructions", label: "Documentation" },
  { href: "https://github.com/NotHarshhaa/pipeline-forge", label: "GitHub", external: true },
  { href: "/#creator", label: "Creator" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 bg-muted/20">
      <div className="generator-grid-bg opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <IconGitBranch className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">Pipeline Forge</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Generate production-ready CI/CD pipelines for modern stacks — with
              security, deploy targets, and best-practice hints built in.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-[10px] font-medium">
                Open source
              </Badge>
              <Badge variant="outline" className="text-[10px] font-medium">
                MIT License
              </Badge>
            </div>
            <Button size="sm" className="gap-2 font-semibold" asChild>
              <Link href="/#generator">
                <IconBolt className="h-4 w-4" />
                Open Pipeline Studio
              </Link>
            </Button>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product
            </h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <IconBrandGithub className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label === "Documentation" && (
                        <IconBook2 className="h-3.5 w-3.5" />
                      )}
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Built with
            <IconHeart className="h-3.5 w-3.5 text-primary" aria-hidden />
            for developers
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Pipeline Forge
          </p>

          <a
            href="https://github.com/NotHarshhaa/pipeline-forge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            <IconBrandGithub className="h-4 w-4" />
            Star on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
