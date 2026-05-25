"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconChevronRight } from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { projectTypes } from "../../constants/options";
import { StepCard } from "../step-card";
import type { StepProps } from "../../types";

export function ProjectDetailsStep({
  config,
  updateConfig,
  currentStep,
  expandedSteps,
  toggleStep,
  completeStep,
}: StepProps) {
  return (
    <StepCard
      stepIndex={0}
      stepNumber={1}
      title="Project Details"
      description="Name your project and select the stack"
      currentStep={currentStep}
      expandedSteps={expandedSteps}
      onToggle={() => toggleStep(0)}
    >
<div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="project-name" className="text-sm">Project Name</Label>
              <input
                id="project-name"
                type="text"
                value={config.projectName}
                onChange={(e) => updateConfig("projectName", e.target.value)}
                className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="my-awesome-app"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Project Type</Label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = config.projectType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() =>
                        updateConfig(
                          "projectType",
                          type.value as PipelineConfig["projectType"]
                        )
                      }
                      className={`flex flex-col items-center gap-1 sm:gap-1.5 rounded-lg border-2 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {(config.projectType === "nodejs" || config.projectType === "python" || config.projectType === "java") && (
              <>
                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="package-manager" className="text-sm">Package Manager</Label>
                    <Select
                      value={config.packageManager || (config.projectType === "nodejs" ? "npm" : config.projectType === "python" ? "pip" : "maven")}
                      onValueChange={(v) => updateConfig("packageManager", v as PipelineConfig["packageManager"])}
                    >
                      <SelectTrigger id="package-manager" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        {config.projectType === "nodejs" && (
                          <>
                            <SelectItem value="npm">npm</SelectItem>
                            <SelectItem value="yarn">Yarn</SelectItem>
                            <SelectItem value="pnpm">pnpm</SelectItem>
                            <SelectItem value="bun">Bun</SelectItem>
                          </>
                        )}
                        {config.projectType === "python" && (
                          <>
                            <SelectItem value="pip">pip</SelectItem>
                            <SelectItem value="poetry">Poetry</SelectItem>
                          </>
                        )}
                        {config.projectType === "java" && (
                          <>
                            <SelectItem value="maven">Maven</SelectItem>
                            <SelectItem value="gradle">Gradle</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="working-dir" className="text-sm">Working Directory</Label>
                    <input
                      id="working-dir"
                      type="text"
                      value={config.workingDirectory || "."}
                      onChange={(e) => updateConfig("workingDirectory", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="."
                    />
                  </div>
                </div>
              </>
            )}

            {(config.projectType === "go" || config.projectType === "rust" || config.projectType === "dotnet") && (
              <>
                <Separator />

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="working-dir" className="text-sm">Working Directory</Label>
                  <input
                    id="working-dir"
                    type="text"
                    value={config.workingDirectory || "."}
                    onChange={(e) => updateConfig("workingDirectory", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="."
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monorepo"
                  checked={config.isMonorepo}
                  onCheckedChange={(checked) => updateConfig("isMonorepo", checked === true)}
                />
                <Label htmlFor="monorepo" className="text-sm font-medium cursor-pointer">
                  Monorepo Project
                </Label>
              </div>

              {config.isMonorepo && (
                <div className="ml-6 space-y-1.5">
                  <Label htmlFor="monorepo-tool" className="text-xs text-muted-foreground">Monorepo Tool</Label>
                  <Select
                    value={config.monorepoTool || "none"}
                    onValueChange={(v) => updateConfig("monorepoTool", v as PipelineConfig["monorepoTool"])}
                  >
                    <SelectTrigger id="monorepo-tool" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="nx">Nx</SelectItem>
                      <SelectItem value="turborepo">Turborepo</SelectItem>
                      <SelectItem value="lerna">Lerna</SelectItem>
                      <SelectItem value="rush">Rush</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(0)}
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
