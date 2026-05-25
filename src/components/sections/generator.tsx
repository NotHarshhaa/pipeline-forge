import { Badge } from "@/components/ui/badge";
import { PipelineGenerator } from "@/components/pipeline-generator";
import { IconWand, IconArrowDown } from "@tabler/icons-react";

export function Generator() {
  return (
    <section id="generator" className="generator-section relative py-16 pb-24 sm:py-20 sm:pb-20 md:py-24 lg:py-28">
      <div className="generator-grid-bg" aria-hidden />
      <div className="generator-glow" aria-hidden />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            <IconWand className="h-3.5 w-3.5 text-primary" />
            Pipeline Studio
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Build your pipeline
            <span className="block text-primary">in one workspace</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Configure stacks, CI providers, deployment targets, and advanced options —
            then preview production-ready YAML instantly. No context switching.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Scroll to configure</span>
            <IconArrowDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        <PipelineGenerator />
      </div>
    </section>
  );
}
