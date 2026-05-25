"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconGitBranch } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function MatrixBuildSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="matrixBuild"
          checked={config.matrixBuild?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("matrixBuild", {
              ...config.matrixBuild!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="matrixBuild" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconGitBranch className="h-4 w-4" />
          Matrix Build (Multi-Version Testing)
        </Label>
      </div>
      {config.matrixBuild?.enabled && (
        <div className="ml-6 space-y-2">
          <Label className="text-xs text-muted-foreground">
            Test versions (comma-separated, e.g., 18, 20, 22)
          </Label>
          <Input
            placeholder="18, 20, 22"
            value={config.matrixBuild?.versions?.join(", ") || ""}
            onChange={(e) => {
              const versions = e.target.value.split(",").map((v) => v.trim()).filter(Boolean);
              updateConfig("matrixBuild", {
                ...config.matrixBuild!,
                versions,
              });
            }}
            className="text-xs h-8"
          />
        </div>
      )}
    </div>
  );
}
