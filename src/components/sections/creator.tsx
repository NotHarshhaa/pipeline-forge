import Link from "next/link";
import {
  IconBrandGithub,
  IconStar,
  IconUser,
  IconGitBranch,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const highlights = [
  "Cloud & DevOps engineer",
  "Platform engineering focus",
  "Open-source contributor",
];

export function Creator() {
  return (
    <section id="creator" className="section-surface relative border-y py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg opacity-40" aria-hidden />
      <div className="generator-glow opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            <IconUser className="h-3.5 w-3.5 text-primary" />
            Creator
          </Badge>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
          {/* Profile */}
          <div className="mx-auto w-full max-w-xs lg:mx-0">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm">
              <div className="relative mx-auto w-fit">
                <div
                  className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 blur-md"
                  aria-hidden
                />
                <img
                  src="https://github.com/NotHarshhaa.png"
                  alt="Harshhaa"
                  width={128}
                  height={128}
                  className="relative h-28 w-28 rounded-2xl border-2 border-border object-cover shadow-md sm:h-32 sm:w-32"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-wide">Harshhaa</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                @NotHarshhaa
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                {highlights.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bio + actions */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built by an engineer who
              <span className="text-primary"> lives in pipelines</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              Pipeline Forge started as a tool to stop rewriting the same CI/CD
              YAML — then grew into a full studio for teams shipping on GitHub,
              GitLab, Jenkins, and beyond.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground lg:mx-0">
              Development Platform & Automation enthusiast · Cloud, DevOps & MLOps
              · Platform Engineering
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button className="w-full gap-2 font-semibold sm:w-auto" asChild>
                <a
                  href="https://github.com/NotHarshhaa"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconBrandGithub className="h-4 w-4" />
                  Follow on GitHub
                </a>
              </Button>
              <Button variant="outline" className="w-full gap-2 sm:w-auto" asChild>
                <a
                  href="https://github.com/NotHarshhaa/pipeline-forge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconStar className="h-4 w-4" />
                  Star Pipeline Forge
                </a>
              </Button>
            </div>

            <Link
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <IconGitBranch className="h-4 w-4" />
              Contribute or report issues on GitHub
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
