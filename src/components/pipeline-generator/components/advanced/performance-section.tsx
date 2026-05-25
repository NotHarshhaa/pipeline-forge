"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { IconRocket } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function PerformanceSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="performance"
          checked={config.performance?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("performance", {
              ...config.performance!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="performance" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconRocket className="h-4 w-4" />
          Performance Testing
        </Label>
      </div>
      {config.performance?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="loadTesting"
              checked={config.performance?.loadTesting}
              onCheckedChange={(checked) =>
                updateConfig("performance", {
                  ...config.performance!,
                  loadTesting: checked as boolean,
                })
              }
            />
            <Label htmlFor="loadTesting" className="text-xs cursor-pointer">
              Load testing (stress tests)
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="benchmarks"
              checked={config.performance?.benchmarks}
              onCheckedChange={(checked) =>
                updateConfig("performance", {
                  ...config.performance!,
                  benchmarks: checked as boolean,
                })
              }
            />
            <Label htmlFor="benchmarks" className="text-xs cursor-pointer">
              Performance benchmarks
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
