"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { IconBrandDocker, IconChevronRight } from "@tabler/icons-react";
import { StepCard } from "../step-card";
import type { StepProps } from "../../types";

export function PipelineStepsStep({
  config,
  updateConfig,
  currentStep,
  expandedSteps,
  toggleStep,
  completeStep,
}: StepProps) {
  return (
    <StepCard
      stepIndex={2}
      stepNumber={3}
      title="Pipeline Steps"
      description="Configure what your pipeline does"
      currentStep={currentStep}
      expandedSteps={expandedSteps}
      onToggle={() => toggleStep(2)}
    >
<div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: "enableLinting" as const, label: "Linting" },
                { key: "enableTests" as const, label: "Unit Tests" },
                { key: "enableE2ETesting" as const, label: "E2E Tests" },
                { key: "enableBuild" as const, label: "Build" },
                { key: "enableCaching" as const, label: "Caching" },
                { key: "enableCodeFormatting" as const, label: "Code Formatting" },
                { key: "enableTypeChecking" as const, label: "Type Checking" },
                { key: "enableSecurityScan" as const, label: "Security Scan" },
                { key: "enableDependencyAudit" as const, label: "Dependency Audit" },
                { key: "enableContainerScan" as const, label: "Container Scan" },
                { key: "enableSonarQube" as const, label: "SonarQube Analysis" },
                { key: "enableDocker" as const, label: "Docker Build" },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={opt.key}
                    checked={config[opt.key]}
                    onCheckedChange={(checked) =>
                      updateConfig(opt.key, checked === true)
                    }
                  />
                  <Label
                    htmlFor={opt.key}
                    className="text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>

            {config.enableDocker && (
              <>
                <Separator />
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconBrandDocker className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <Label className="text-xs sm:text-sm font-semibold">Docker Settings</Label>
                  </div>
                  <input
                    type="text"
                    value={config.dockerImageName || ""}
                    onChange={(e) =>
                      updateConfig("dockerImageName", e.target.value)
                    }
                    className="flex h-8 sm:h-9 w-full rounded-md border border-input bg-background px-2.5 sm:px-3 py-1 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Docker image name (e.g., myapp)"
                  />
                </div>
              </>
            )}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(2)}
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
