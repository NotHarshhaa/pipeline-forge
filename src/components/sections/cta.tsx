import Link from "next/link";
import { IconBolt, IconBrandGithub, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CTA() {
  return (
    <section className="section-surface relative py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg" aria-hidden />
      <div className="generator-glow" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/90 to-card/80 p-8 text-center shadow-xl backdrop-blur-sm sm:p-12 lg:p-14">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-inset ring-primary/20">
            <IconSparkles className="h-7 w-7" />
          </div>

          <Badge
            variant="secondary"
            className="mx-auto mt-6 gap-1.5 border-primary/20 bg-background/60 px-3 py-1 text-xs"
          >
            Start in under a minute
          </Badge>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to simplify your
            <span className="text-primary"> DevOps workflow?</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Stop writing YAML from scratch. Open Pipeline Studio, pick a preset,
            and export a production-ready pipeline today.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" asChild>
              <Link href="/#generator">
                <IconBolt className="h-5 w-5" />
                Open Pipeline Studio
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 border-primary/20 bg-background/50 sm:w-auto"
              asChild
            >
              <a
                href="https://github.com/NotHarshhaa/pipeline-forge"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub className="h-5 w-5" />
                Star on GitHub
              </a>
            </Button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Free · Open source · Runs in your browser
          </p>
        </div>
      </div>
    </section>
  );
}
