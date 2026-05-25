"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconTerminal } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function CustomScriptsSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <Label className="text-sm font-semibold flex items-center gap-2">
        <IconTerminal className="h-4 w-4" />
        Custom Scripts
      </Label>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Pre-Build Script</Label>
          <Textarea
            placeholder="Commands to run before build (e.g., echo 'Starting build')"
            value={config.customScripts?.preBuild || ""}
            onChange={(e) =>
              updateConfig("customScripts", {
                ...config.customScripts,
                preBuild: e.target.value,
              })
            }
            className="text-xs font-mono min-h-[60px]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Pre-Test Script</Label>
          <Textarea
            placeholder="Commands to run before tests (e.g., npm run db:seed)"
            value={config.customScripts?.preTest || ""}
            onChange={(e) =>
              updateConfig("customScripts", {
                ...config.customScripts,
                preTest: e.target.value,
              })
            }
            className="text-xs font-mono min-h-[60px]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Post-Build Script</Label>
          <Textarea
            placeholder="Commands to run after build (e.g., npm run analyze)"
            value={config.customScripts?.postBuild || ""}
            onChange={(e) =>
              updateConfig("customScripts", {
                ...config.customScripts,
                postBuild: e.target.value,
              })
            }
            className="text-xs font-mono min-h-[60px]"
          />
        </div>
      </div>
    </div>
  );
}
