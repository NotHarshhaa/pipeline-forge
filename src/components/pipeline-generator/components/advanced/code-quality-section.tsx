"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconChartBar } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function CodeQualitySection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="codeQuality"
          checked={config.codeQuality?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("codeQuality", {
              ...config.codeQuality!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="codeQuality" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconChartBar className="h-4 w-4" />
          Code Quality & Coverage
        </Label>
      </div>
      {config.codeQuality?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Coverage threshold (%)
            </Label>
            <Input
              type="number"
              placeholder="80"
              min="0"
              max="100"
              value={config.codeQuality?.coverageThreshold || 80}
              onChange={(e) =>
                updateConfig("codeQuality", {
                  ...config.codeQuality!,
                  coverageThreshold: parseInt(e.target.value) || 80,
                })
              }
              className="text-xs h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="qualityGate"
              checked={config.codeQuality?.qualityGate}
              onCheckedChange={(checked) =>
                updateConfig("codeQuality", {
                  ...config.codeQuality!,
                  qualityGate: checked as boolean,
                })
              }
            />
            <Label htmlFor="qualityGate" className="text-xs cursor-pointer">
              Enable quality gate (fail on low coverage)
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
