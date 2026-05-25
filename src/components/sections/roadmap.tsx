import { IconCircleCheck, IconCircleDashed, IconMap } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const completed = [
  "GitLab CI support",
  "Jenkins pipeline generation",
  "CircleCI support",
  "Azure Pipelines support",
  "Configuration persistence (save/load)",
  "YAML syntax highlighting",
  "Quick presets for common configurations",
  "Configuration export/import (JSON)",
  "Undo/redo functionality",
  "Best practices analyzer",
  "Cost estimation per pipeline",
];

const planned = [
  "Travis CI support",
  "Bitbucket Pipelines support",
  "Kubernetes deployment templates (advanced)",
  "AI-powered pipeline optimization",
  "Pipeline visualization (graph view)",
];

export function Roadmap() {
  const doneCount = completed.length;
  const totalCount = doneCount + planned.length;
  const progress = Math.round((doneCount / totalCount) * 100);

  return (
    <section id="roadmap" className="section-surface relative py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            <IconMap className="h-3.5 w-3.5 text-primary" />
            Roadmap
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What we&apos;ve shipped
            <span className="text-primary"> & what&apos;s next</span>
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Pipeline Forge evolves in the open. Track progress and request features
            on GitHub.
          </p>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-5 backdrop-blur-sm sm:p-6">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="font-medium">Overall progress</span>
            <span className="font-mono text-primary">{progress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {doneCount} of {totalCount} roadmap items completed
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Shipped */}
          <div className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-emerald-500/10 bg-emerald-500/5 px-5 py-4">
              <IconCircleCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold">Shipped</h3>
              <Badge
                variant="secondary"
                className="ml-auto border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400"
              >
                {doneCount} items
              </Badge>
            </div>
            <ul className="divide-y divide-border/50 p-2">
              {completed.map((label) => (
                <li
                  key={label}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm"
                >
                  <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-muted-foreground">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Planned */}
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-border/50 bg-muted/30 px-5 py-4">
              <IconCircleDashed className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold">Planned</h3>
              <Badge variant="outline" className="ml-auto text-[10px]">
                {planned.length} items
              </Badge>
            </div>
            <ul className="divide-y divide-border/50 p-2">
              {planned.map((label) => (
                <li
                  key={label}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm"
                  )}
                >
                  <IconCircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
