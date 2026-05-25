"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IconGitBranch } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function ConditionalExecutionSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="conditionalSteps"
          checked={config.conditionalSteps?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("conditionalSteps", {
              ...config.conditionalSteps!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="conditionalSteps" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconGitBranch className="h-4 w-4" />
          Conditional Step Execution
        </Label>
      </div>
      {config.conditionalSteps?.enabled && (
        <div className="ml-6 space-y-2">
          <p className="text-xs text-muted-foreground">
            Run steps only when specific conditions are met
          </p>
        </div>
      )}
    </div>
  );
}
