import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBook2,
  IconArrowLeft,
  IconArrowRight,
  IconBolt,
} from "@tabler/icons-react";

export function InstructionsHero() {
  return (
    <section className="section-surface relative border-b">
      <div className="generator-grid-bg opacity-60" aria-hidden />
      <div className="generator-glow opacity-70" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            <IconBook2 className="h-3.5 w-3.5 text-primary" />
            Documentation
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How to build your
            <span className="block text-primary">first pipeline</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            A step-by-step walkthrough of Pipeline Studio — from presets to
            generated YAML. Most teams are live in under a minute.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" asChild>
              <Link href="/#generator">
                <IconBolt className="h-4 w-4" />
                Open Pipeline Studio
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto" asChild>
              <Link href="/">
                <IconArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </div>

          <a
            href="#guide"
            className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Jump to step-by-step guide
            <IconArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
