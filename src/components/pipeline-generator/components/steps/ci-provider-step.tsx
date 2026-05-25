"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { IconChevronRight } from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { ciProviders } from "../../constants/options";
import { StepCard } from "../step-card";
import type { StepProps } from "../../types";

export function CiProviderStep({
  config,
  updateConfig,
  currentStep,
  expandedSteps,
  toggleStep,
  completeStep,
}: StepProps) {
  return (
    <StepCard
      stepIndex={1}
      stepNumber={2}
      title="CI/CD Provider"
      description="Choose your pipeline platform and configure settings"
      currentStep={currentStep}
      expandedSteps={expandedSteps}
      onToggle={() => toggleStep(1)}
    >
<div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Provider</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {ciProviders.map((provider) => {
                  const Icon = provider.icon;
                  const isSelected = config.ciProvider === provider.value;
                  return (
                    <button
                      key={provider.value}
                      onClick={() =>
                        updateConfig(
                          "ciProvider",
                          provider.value as PipelineConfig["ciProvider"]
                        )
                      }
                      className={`relative flex flex-col items-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-center leading-tight">{provider.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm font-semibold">Pipeline Settings</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="concurrency" className="text-xs text-muted-foreground">
                    Concurrency Limit
                  </Label>
                  <Input
                    id="concurrency"
                    type="number"
                    min="1"
                    max="10"
                    value={config.ciSettings?.concurrency || 1}
                    onChange={(e) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        concurrency: parseInt(e.target.value) || 1,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="timeout" className="text-xs text-muted-foreground">
                    Timeout (minutes)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="360"
                    value={config.ciSettings?.timeout || 60}
                    onChange={(e) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        timeout: parseInt(e.target.value) || 60,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retry-on-failure"
                    checked={config.ciSettings?.retryOnFailure}
                    onCheckedChange={(checked) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        retryOnFailure: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="retry-on-failure" className="text-xs cursor-pointer">
                    Retry on failure (auto-retry failed jobs)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parallel-jobs"
                    checked={config.ciSettings?.parallelJobs}
                    onCheckedChange={(checked) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        parallelJobs: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="parallel-jobs" className="text-xs cursor-pointer">
                    Enable parallel job execution
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(1)}
                size="sm"
                className="gap-2"
              >
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
    </StepCard>
  );
}
