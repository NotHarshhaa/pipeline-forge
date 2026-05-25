"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IconSparkles } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function PipelineOptimizationSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="optimization"
          checked={config.optimization?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("optimization", {
              ...config.optimization!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="optimization" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconSparkles className="h-4 w-4" />
          Pipeline Optimization
        </Label>
      </div>
      {config.optimization?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="parallelizeTests"
              checked={config.optimization?.parallelizeTests}
              onCheckedChange={(checked) =>
                updateConfig("optimization", {
                  ...config.optimization!,
                  parallelizeTests: checked as boolean,
                })
              }
            />
            <Label htmlFor="parallelizeTests" className="text-xs cursor-pointer">
              Parallelize test execution
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="cacheDependencies"
              checked={config.optimization?.cacheDependencies}
              onCheckedChange={(checked) =>
                updateConfig("optimization", {
                  ...config.optimization!,
                  cacheDependencies: checked as boolean,
                })
              }
            />
            <Label htmlFor="cacheDependencies" className="text-xs cursor-pointer">
              Cache dependencies
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="useBuildKit"
              checked={config.optimization?.useBuildKit}
              onCheckedChange={(checked) =>
                updateConfig("optimization", {
                  ...config.optimization!,
                  useBuildKit: checked as boolean,
                })
              }
            />
            <Label htmlFor="useBuildKit" className="text-xs cursor-pointer">
              Use Docker BuildKit (faster builds)
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
