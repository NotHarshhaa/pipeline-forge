"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCloud, IconChevronRight } from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { deployTargets } from "../../constants/options";
import { StepCard } from "../step-card";
import type { StepProps } from "../../types";

export function DeploymentStep({
  config,
  updateConfig,
  currentStep,
  expandedSteps,
  toggleStep,
  completeStep,
}: StepProps) {
  return (
    <StepCard
      stepIndex={3}
      stepNumber={4}
      title="Deployment"
      description="Where should your app be deployed?"
      currentStep={currentStep}
      expandedSteps={expandedSteps}
      onToggle={() => toggleStep(3)}
    >
<div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Deployment Target</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                {deployTargets.map((target) => {
                  const Icon = "icon" in target ? target.icon : null;
                  const isSelected = config.deployTarget === target.value;
                  return (
                    <button
                      key={target.value}
                      onClick={() =>
                        updateConfig(
                          "deployTarget",
                          target.value as PipelineConfig["deployTarget"]
                        )
                      }
                      className={`flex items-center gap-2 rounded-lg border-2 p-2.5 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{target.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Target Branches</Label>
              <Select
                value={config.branches[0]}
                onValueChange={(v) => updateConfig("branches", [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="master">master</SelectItem>
                  <SelectItem value="develop">develop</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                  <SelectItem value="production">production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.deployTarget !== "none" && (
              <>
                <Separator />
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <IconCloud className="h-4 w-4 text-primary" />
                    <Label className="text-xs font-semibold">Deployment Settings</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {config.deployTarget === "aws" && "Deploy to AWS ECS with automated container orchestration"}
                    {config.deployTarget === "kubernetes" && "Deploy to Kubernetes cluster with kubectl apply"}
                    {config.deployTarget === "vercel" && "Deploy to Vercel with automatic preview deployments"}
                    {config.deployTarget === "netlify" && "Deploy to Netlify with continuous deployment"}
                    {config.deployTarget === "heroku" && "Deploy to Heroku with Git-based deployment"}
                    {config.deployTarget === "azure" && "Deploy to Azure App Service with CI/CD integration"}
                    {config.deployTarget === "gcp" && "Deploy to Google Cloud Platform with Cloud Run"}
                    {config.deployTarget === "fly-io" && "Deploy to Fly.io with global edge deployment"}
                    {config.deployTarget === "railway" && "Deploy to Railway with automatic scaling"}
                    {config.deployTarget === "cloudflare-pages" && "Deploy to Cloudflare Pages with global CDN"}
                    {config.deployTarget === "digitalocean" && "Deploy to DigitalOcean App Platform"}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(3)}
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
