"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconRocket } from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import type { AdvancedSectionProps } from "./types";

export function DeploymentStrategySection({ config, updateConfig }: AdvancedSectionProps) {
  if (config.deployTarget === "none") return null;

  return (
    <div className="space-y-1.5 sm:space-y-3">
      <Label className="text-sm font-semibold flex items-center gap-2">
        <IconRocket className="h-4 w-4" />
        Deployment Strategy
      </Label>
      <Select
        value={config.deploymentStrategy || "rolling"}
        onValueChange={(value) =>
          updateConfig("deploymentStrategy", value as PipelineConfig["deploymentStrategy"])
        }
      >
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={5}>
          <SelectItem value="rolling">Rolling Update (Gradual)</SelectItem>
          <SelectItem value="blue-green">Blue-Green (Zero Downtime)</SelectItem>
          <SelectItem value="canary">Canary (Gradual Traffic)</SelectItem>
          <SelectItem value="recreate">Recreate (Stop & Start)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
