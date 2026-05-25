"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconPackage } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function ArtifactsSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="artifacts"
          checked={config.artifacts?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("artifacts", {
              ...config.artifacts!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="artifacts" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconPackage className="h-4 w-4" />
          Artifact Management
        </Label>
      </div>
      {config.artifacts?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Artifact paths (comma-separated)
            </Label>
            <Input
              placeholder="dist/, build/, *.zip"
              value={config.artifacts?.paths?.join(", ") || ""}
              onChange={(e) => {
                const paths = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
                updateConfig("artifacts", {
                  ...config.artifacts!,
                  paths,
                });
              }}
              className="text-xs h-8"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Retention days
            </Label>
            <Input
              type="number"
              placeholder="30"
              value={config.artifacts?.retention || 30}
              onChange={(e) =>
                updateConfig("artifacts", {
                  ...config.artifacts!,
                  retention: parseInt(e.target.value) || 30,
                })
              }
              className="text-xs h-8"
            />
          </div>
        </div>
      )}
    </div>
  );
}
