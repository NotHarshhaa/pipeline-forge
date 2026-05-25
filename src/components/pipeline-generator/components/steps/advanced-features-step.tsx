"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconCheck } from "@tabler/icons-react";
import { StepCard } from "../step-card";
import type { StepProps } from "../../types";
import {
  EnvironmentVariablesSection,
  CustomScriptsSection,
  NotificationsSection,
  MatrixBuildSection,
  ArtifactsSection,
  ScheduleSection,
  CodeQualitySection,
  PerformanceSection,
  ServicesSection,
  DeploymentStrategySection,
  MultiEnvironmentSection,
  PipelineOptimizationSection,
  CustomActionsSection,
  ConditionalExecutionSection,
} from "../advanced";

export function AdvancedFeaturesStep({
  config,
  updateConfig,
  currentStep,
  expandedSteps,
  toggleStep,
  setExpandedSteps,
  setCurrentStep,
}: StepProps) {
  const sectionProps = { config, updateConfig };

  return (
    <StepCard
      stepIndex={4}
      stepNumber={5}
      title="Advanced Features"
      description="Environment variables, custom scripts, and notifications"
      optional
      currentStep={currentStep}
      expandedSteps={expandedSteps}
      onToggle={() => toggleStep(4)}
      contentClassName="space-y-3 sm:space-y-5"
    >
      <EnvironmentVariablesSection {...sectionProps} />
      <Separator />
      <CustomScriptsSection {...sectionProps} />
      <Separator />
      <NotificationsSection {...sectionProps} />
      <Separator />
      <MatrixBuildSection {...sectionProps} />
      <Separator />
      <ArtifactsSection {...sectionProps} />
      <Separator />
      <ScheduleSection {...sectionProps} />
      <Separator />
      <CodeQualitySection {...sectionProps} />
      <Separator />
      <PerformanceSection {...sectionProps} />
      <Separator />
      <ServicesSection {...sectionProps} />
      <Separator />
      <DeploymentStrategySection {...sectionProps} />
      <Separator />
      <MultiEnvironmentSection {...sectionProps} />
      <Separator />
      <PipelineOptimizationSection {...sectionProps} />
      <Separator />
      <CustomActionsSection {...sectionProps} />
      <Separator />
      <ConditionalExecutionSection {...sectionProps} />

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => {
            setExpandedSteps((prev) => new Set([...prev, 4]));
            setCurrentStep(4);
          }}
          size="sm"
          className="gap-2"
        >
          Done
          <IconCheck className="h-4 w-4" />
        </Button>
      </div>
    </StepCard>
  );
}
