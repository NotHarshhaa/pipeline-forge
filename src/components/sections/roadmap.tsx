import { IconCircleCheck, IconCircleDashed } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const roadmap = [
  { label: "GitLab CI support", done: true },
  { label: "Jenkins pipeline generation", done: true },
  { label: "CircleCI support", done: true },
  { label: "Azure Pipelines support", done: true },
  { label: "Configuration persistence (save/load)", done: true },
  { label: "YAML syntax highlighting", done: true },
  { label: "Quick presets for common configurations", done: true },
  { label: "Configuration export/import (JSON)", done: true },
  { label: "Undo/redo functionality", done: true },
  { label: "Best practices analyzer", done: true },
  { label: "Cost estimation per pipeline", done: true },
  { label: "Travis CI support", done: false },
  { label: "Bitbucket Pipelines support", done: false },
  { label: "Kubernetes deployment templates (advanced)", done: false },
  { label: "AI-powered pipeline optimization", done: false },
  { label: "Pipeline visualization (graph view)", done: false },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="py-6 sm:py-8 md:py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge variant="secondary" className="mb-2 sm:mb-3">Roadmap</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            What&apos;s coming next
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            We&apos;re constantly improving Pipeline Forge.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {roadmap.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2.5 sm:gap-3 rounded-lg border bg-card p-3 sm:p-4"
            >
              {item.done ? (
                <IconCircleCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0" />
              ) : (
                <IconCircleDashed className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-medium flex-1 ${item.done ? "line-through text-muted-foreground" : ""}`}>
                {item.label}
              </span>
              {!item.done && (
                <Badge variant="outline" className="text-[10px] shrink-0">
                  Planned
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
