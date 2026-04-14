import { IconBrandGithub, IconHeart, IconGitBranch } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const quickLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#generator", label: "Generator" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  const resources = [
    { href: "https://github.com/NotHarshhaa/pipeline-forge", label: "GitHub" },
    { href: "#creator", label: "About" },
  ];

  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-4">
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconGitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <span className="font-bold text-sm sm:text-base">Pipeline Forge</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Generate production-ready CI/CD pipelines for modern applications
            </p>
          </div>

          {/* Quick Links */}
          <div className="hidden md:block">
            <h3 className="font-semibold text-sm mb-2">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="hidden md:block">
            <h3 className="font-semibold text-sm mb-2">Resources</h3>
            <ul className="space-y-1">
              {resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-3 sm:my-4" />

        {/* Bottom Bar - Compact Mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          {/* Left - Tagline */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <IconHeart className="h-3 w-3 text-primary" /> for
            <span className="hidden sm:inline"> developers</span>
          </p>

          {/* Center - Mobile Quick Links */}
          <div className="flex items-center gap-3 sm:hidden text-xs text-muted-foreground">
            {quickLinks.slice(0, 2).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right - License & GitHub */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs text-muted-foreground">
            <span className="hidden sm:inline">MIT License</span>
            <a
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <IconBrandGithub className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
