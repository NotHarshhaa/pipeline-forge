import type { PipelineConfig } from "@/lib/generate-pipeline";
import type { UpdateConfigFn } from "../../types";

export interface AdvancedSectionProps {
  config: PipelineConfig;
  updateConfig: UpdateConfigFn;
}
