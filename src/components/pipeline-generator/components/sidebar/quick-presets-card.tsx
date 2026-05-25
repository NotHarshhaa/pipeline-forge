"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconTemplate } from "@tabler/icons-react";
import { presetLabels } from "../../constants/presets";

export function QuickPresetsCard({
  onApplyPreset,
}: {
  onApplyPreset: (key: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <IconTemplate className="h-4 w-4 sm:h-5 sm:w-5" />
          Quick Presets
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Start with a pre-configured template
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
          {Object.entries(presetLabels).map(([key, { label, description, icon: Icon }]) => (
            <button
              key={key}
              onClick={() => onApplyPreset(key)}
              className="flex items-start gap-3 p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
            >
              <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
