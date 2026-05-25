"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPackage, IconPlus, IconTrash } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function CustomActionsSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <IconPackage className="h-4 w-4" />
          Custom Marketplace Actions
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newActions = [...(config.customActions || []), { name: "", uses: "", with: {} }];
            updateConfig("customActions", newActions);
          }}
          className="h-7 text-xs gap-1"
        >
          <IconPlus className="h-3 w-3" />
          Add Action
        </Button>
      </div>
      {config.customActions && config.customActions.length > 0 ? (
        <div className="space-y-2">
          {config.customActions.map((action, index) => (
            <div key={index} className="rounded-lg border bg-muted/30 p-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Action name"
                  value={action.name}
                  onChange={(e) => {
                    const newActions = [...config.customActions!];
                    newActions[index].name = e.target.value;
                    updateConfig("customActions", newActions);
                  }}
                  className="flex-1 h-8 text-xs"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newActions = config.customActions!.filter((_, i) => i !== index);
                    updateConfig("customActions", newActions);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <IconTrash className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </div>
              <Input
                placeholder="uses: username/action@v1"
                value={action.uses}
                onChange={(e) => {
                  const newActions = [...config.customActions!];
                  newActions[index].uses = e.target.value;
                  updateConfig("customActions", newActions);
                }}
                className="h-8 text-xs font-mono"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No custom actions added</p>
      )}
    </div>
  );
}
