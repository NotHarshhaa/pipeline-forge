"use client";

import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import { usePipelineGenerator } from "./hooks/use-pipeline-generator";
import { CostEstimationCard } from "./components/sidebar/cost-estimation-card";
import { BestPracticesCard } from "./components/sidebar/best-practices-card";
import { QuickPresetsCard } from "./components/sidebar/quick-presets-card";
import { SavedConfigsCard } from "./components/sidebar/saved-configs-card";
import { ProgressIndicatorCard } from "./components/sidebar/progress-indicator-card";
import { ProjectDetailsStep } from "./components/steps/project-details-step";
import { CiProviderStep } from "./components/steps/ci-provider-step";
import { PipelineStepsStep } from "./components/steps/pipeline-steps-step";
import { DeploymentStep } from "./components/steps/deployment-step";
import { AdvancedFeaturesStep } from "./components/steps/advanced-features-step";
import { OutputPanel } from "./components/output-panel";
import type { StepProps } from "./types";

export function PipelineGenerator() {
  const ctx = usePipelineGenerator();

  const stepProps: StepProps = {
    config: ctx.config,
    updateConfig: ctx.updateConfig,
    currentStep: ctx.currentStep,
    expandedSteps: ctx.expandedSteps,
    toggleStep: ctx.toggleStep,
    completeStep: ctx.completeStep,
    setExpandedSteps: ctx.setExpandedSteps,
    setCurrentStep: ctx.setCurrentStep,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <div className="space-y-3 sm:space-y-6">
        <CostEstimationCard costEstimate={ctx.costEstimate} />
        <BestPracticesCard suggestions={ctx.suggestions} />
        <QuickPresetsCard onApplyPreset={ctx.handleApplyPreset} />
        <SavedConfigsCard
          savedConfigs={ctx.savedConfigs}
          historyIndex={ctx.historyIndex}
          historyLength={ctx.historyLength}
          onSave={ctx.handleSaveConfig}
          onReset={ctx.handleResetConfig}
          onUndo={ctx.handleUndo}
          onRedo={ctx.handleRedo}
          onExport={ctx.handleExportConfig}
          onImport={ctx.handleImportConfig}
          onLoad={ctx.handleLoadConfig}
          onDelete={ctx.handleDeleteConfig}
        />
        <ProgressIndicatorCard
          currentStep={ctx.currentStep}
          expandedSteps={ctx.expandedSteps}
          onGoToStep={ctx.goToStep}
        />

        <ProjectDetailsStep {...stepProps} />
        <CiProviderStep {...stepProps} />
        <PipelineStepsStep {...stepProps} />
        <DeploymentStep {...stepProps} />
        <AdvancedFeaturesStep {...stepProps} />

        <Button
          onClick={ctx.handleGenerate}
          size="lg"
          className="w-full text-sm sm:text-base font-semibold gap-2"
        >
          <IconSparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          Generate Pipeline
        </Button>
      </div>

      <OutputPanel
        config={ctx.config}
        output={ctx.output}
        copied={ctx.copied}
        onCopy={ctx.handleCopy}
        onDownload={ctx.handleDownload}
      />
    </div>
  );
}
