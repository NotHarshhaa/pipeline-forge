"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { IconCloud } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function MultiEnvironmentSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="environments"
          checked={config.environments?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("environments", {
              ...config.environments!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="environments" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconCloud className="h-4 w-4" />
          Multi-Environment Deployment
        </Label>
      </div>
      {config.environments?.enabled && (
        <div className="ml-6 space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              Environments (name:branch pairs)
            </Label>
            <Textarea
              placeholder="development:develop&#10;staging:staging&#10;production:main"
              value={config.environments?.stages?.map(s => `${s.name}:${s.branch}`).join("\n") || ""}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter(Boolean);
                const stages = lines.map(line => {
                  const [name, branch] = line.split(":").map(s => s.trim());
                  return { name: name || "production", branch: branch || "main", autoDeploy: true, requireApproval: false };
                });
                updateConfig("environments", {
                  ...config.environments!,
                  stages,
                });
              }}
              className="text-xs font-mono min-h-[80px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
