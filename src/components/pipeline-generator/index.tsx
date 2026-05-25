"use client";

import { Button } from "@/components/ui/button";
import { IconSparkles } from "@tabler/icons-react";
import { usePipelineGenerator } from "./hooks/use-pipeline-generator";
import { GeneratorToolbar } from "./components/layout/generator-toolbar";
import { GeneratorStepper } from "./components/layout/generator-stepper";
import { GeneratorSidebar } from "./components/layout/generator-sidebar";
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
    <div className="generator-workbench overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl shadow-primary/5 backdrop-blur-sm">
      <GeneratorToolbar
        config={ctx.config}
        currentStep={ctx.currentStep}
        hasOutput={!!ctx.output}
        onGenerate={ctx.handleGenerate}
      />

      <div className="flex flex-col xl:flex-row xl:min-h-[640px]">
        <div className="relative z-10 w-full min-w-0 shrink-0 xl:w-72 xl:max-w-[288px]">
          <GeneratorSidebar
            savedConfigs={ctx.savedConfigs}
            historyIndex={ctx.historyIndex}
            historyLength={ctx.historyLength}
            costEstimate={ctx.costEstimate}
            suggestions={ctx.suggestions}
            onApplyPreset={ctx.handleApplyPreset}
            onSave={ctx.handleSaveConfig}
            onReset={ctx.handleResetConfig}
            onUndo={ctx.handleUndo}
            onRedo={ctx.handleRedo}
            onExport={ctx.handleExportConfig}
            onImport={ctx.handleImportConfig}
            onLoad={ctx.handleLoadConfig}
            onDelete={ctx.handleDeleteConfig}
          />
        </div>

        <div className="relative isolate z-0 flex min-w-0 flex-1 flex-col overflow-hidden border-t xl:border-t-0 xl:border-r">
          <GeneratorStepper
            currentStep={ctx.currentStep}
            onGoToStep={ctx.goToStep}
          />

          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:space-y-4 sm:p-6 max-h-[70vh] xl:max-h-none">
            <ProjectDetailsStep {...stepProps} />
            <CiProviderStep {...stepProps} />
            <PipelineStepsStep {...stepProps} />
            <DeploymentStep {...stepProps} />
            <AdvancedFeaturesStep {...stepProps} />
          </div>
        </div>

        <div className="xl:w-[min(440px,42%)] shrink-0">
          <OutputPanel
            config={ctx.config}
            output={ctx.output}
            validation={ctx.validation}
            copied={ctx.copied}
            onCopy={ctx.handleCopy}
            onDownload={ctx.handleDownload}
            className="xl:sticky xl:top-20"
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 xl:hidden">
        <Button
          onClick={ctx.handleGenerate}
          size="lg"
          className="w-full gap-2 font-semibold shadow-lg"
        >
          <IconSparkles className="h-4 w-4" />
          Generate Pipeline
        </Button>
      </div>
    </div>
  );
}
