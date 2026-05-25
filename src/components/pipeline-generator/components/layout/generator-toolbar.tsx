"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBrandGithub,
  IconSparkles,
  IconCode,
} from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { projectTypes, ciProviders, steps } from "../../constants/options";
import { cn } from "@/lib/utils";

interface GeneratorToolbarProps {
  config: PipelineConfig;
  currentStep: number;
  hasOutput: boolean;
  onGenerate: () => void;
}

export function GeneratorToolbar({
  config,
  currentStep,
  hasOutput,
  onGenerate,
}: GeneratorToolbarProps) {
  const projectLabel =
    projectTypes.find((p) => p.value === config.projectType)?.label ?? config.projectType;
  const providerLabel =
    ciProviders.find((p) => p.value === config.ciProvider)?.label ?? config.ciProvider;

  return (
    <div className="flex flex-col gap-3 border-b bg-card/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <IconCode className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold tracking-tight sm:text-lg">
              {config.projectName || "my-app"}
            </h3>
            <Badge variant="secondary" className="text-[10px] font-medium">
              {projectLabel}
            </Badge>
            <Badge variant="outline" className="gap-1 text-[10px] font-medium">
              <IconBrandGithub className="h-3 w-3" />
              {providerLabel}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {steps[currentStep]?.title} · Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      <Button
        onClick={onGenerate}
        size="lg"
        className={cn(
          "w-full shrink-0 gap-2 font-semibold shadow-md sm:w-auto",
          hasOutput && "ring-2 ring-primary/20"
        )}
      >
        <IconSparkles className="h-4 w-4" />
        Generate Pipeline
      </Button>
    </div>
  );
}
