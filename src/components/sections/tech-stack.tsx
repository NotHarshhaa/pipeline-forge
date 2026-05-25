import {
  IconBrandNextjs,
  IconBrandTailwind,
  IconFileText,
  IconServer,
  IconStack2,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

const techStack = [
  {
    icon: IconBrandNextjs,
    label: "Next.js",
    description: "App router, server components, fast builds",
  },
  {
    icon: IconBrandTailwind,
    label: "Tailwind CSS",
    description: "Utility-first styling and design tokens",
  },
  {
    icon: IconFileText,
    label: "shadcn/ui",
    description: "Accessible, composable UI primitives",
  },
  {
    icon: IconServer,
    label: "TypeScript",
    description: "End-to-end type safety across the app",
  },
];

export function TechStack() {
  return (
    <section className="section-surface relative border-y py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            <IconStack2 className="h-3.5 w-3.5 text-primary" />
            Tech stack
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built with modern
            <span className="text-primary"> tooling</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Pipeline Forge is open source and runs entirely in your browser — no
            backend required for configuration.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.label}
                className="group flex flex-col items-center rounded-2xl border border-border/70 bg-card/80 p-6 text-center shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{tech.label}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {tech.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
