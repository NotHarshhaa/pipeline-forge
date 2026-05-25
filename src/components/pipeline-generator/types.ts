import type { PipelineConfig, ValidationResult } from "@/lib/generate-pipeline";
import type { CostEstimate } from "./utils/estimate-cost";
import type { Suggestion } from "./utils/analyze-best-practices";

export type UpdateConfigFn = <K extends keyof PipelineConfig>(
  key: K,
  value: PipelineConfig[K]
) => void;

export interface PipelineGeneratorContext {
  config: PipelineConfig;
  updateConfig: UpdateConfigFn;
  output: string;
  validation: ValidationResult | null;
  copied: boolean;
  savedConfigs: Record<string, PipelineConfig>;
  currentConfigName: string;
  historyIndex: number;
  historyLength: number;
  currentStep: number;
  expandedSteps: Set<number>;
  suggestions: Suggestion[];
  costEstimate: CostEstimate;
  handleSaveConfig: () => void;
  handleLoadConfig: (name: string) => void;
  handleDeleteConfig: (name: string) => void;
  handleResetConfig: () => void;
  handleApplyPreset: (presetKey: string) => void;
  handleExportConfig: () => void;
  handleImportConfig: () => void;
  handleGenerate: () => void;
  handleCopy: () => void;
  handleDownload: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  toggleStep: (stepIndex: number) => void;
  goToStep: (stepIndex: number) => void;
  completeStep: (stepIndex: number) => void;
  setExpandedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

export interface StepProps {
  config: PipelineConfig;
  updateConfig: UpdateConfigFn;
  currentStep: number;
  expandedSteps: Set<number>;
  toggleStep: (stepIndex: number) => void;
  completeStep: (stepIndex: number) => void;
  setExpandedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}
