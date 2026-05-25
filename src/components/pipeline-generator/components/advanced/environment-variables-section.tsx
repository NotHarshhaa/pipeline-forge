"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconVariable, IconPlus, IconTrash } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function EnvironmentVariablesSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <IconVariable className="h-4 w-4" />
          Environment Variables
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newVars = [...(config.environmentVariables || []), { key: "", value: "" }];
            updateConfig("environmentVariables", newVars);
          }}
          className="h-7 text-xs gap-1"
        >
          <IconPlus className="h-3 w-3" />
          Add
        </Button>
      </div>
      {config.environmentVariables && config.environmentVariables.length > 0 ? (
        <div className="space-y-2">
          {config.environmentVariables.map((env, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="KEY"
                value={env.key}
                onChange={(e) => {
                  const newVars = [...config.environmentVariables!];
                  newVars[index].key = e.target.value;
                  updateConfig("environmentVariables", newVars);
                }}
                className="flex-1 h-8 text-xs"
              />
              <Input
                placeholder="value"
                value={env.value}
                onChange={(e) => {
                  const newVars = [...config.environmentVariables!];
                  newVars[index].value = e.target.value;
                  updateConfig("environmentVariables", newVars);
                }}
                className="flex-1 h-8 text-xs"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newVars = config.environmentVariables!.filter((_, i) => i !== index);
                  updateConfig("environmentVariables", newVars);
                }}
                className="h-8 w-8 p-0"
              >
                <IconTrash className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No environment variables added</p>
      )}
    </div>
  );
}
