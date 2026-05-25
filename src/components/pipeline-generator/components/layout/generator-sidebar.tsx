"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  IconTemplate,
  IconDeviceFloppy,
  IconBulb,
  IconCode,
  IconTrash,
  IconDownload,
  IconUpload,
  IconRotate,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { presetLabels } from "../../constants/presets";
import type { CostEstimate } from "../../utils/estimate-cost";
import type { Suggestion } from "../../utils/analyze-best-practices";
import { cn } from "@/lib/utils";

type ToolkitTab = "templates" | "saved" | "insights";

const TOOLKIT_TABS: {
  id: ToolkitTab;
  label: string;
  icon: typeof IconTemplate;
}[] = [
  { id: "templates", label: "Templates", icon: IconTemplate },
  { id: "saved", label: "Saved", icon: IconDeviceFloppy },
  { id: "insights", label: "Insights", icon: IconBulb },
];

interface GeneratorSidebarProps {
  savedConfigs: Record<string, PipelineConfig>;
  historyIndex: number;
  historyLength: number;
  costEstimate: CostEstimate;
  suggestions: Suggestion[];
  onApplyPreset: (key: string) => void;
  onSave: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: () => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export function GeneratorSidebar({
  savedConfigs,
  historyIndex,
  historyLength,
  costEstimate,
  suggestions,
  onApplyPreset,
  onSave,
  onReset,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onLoad,
  onDelete,
}: GeneratorSidebarProps) {
  const [activeTab, setActiveTab] = useState<ToolkitTab>("templates");

  return (
    <aside className="flex h-full min-w-0 flex-col border-b bg-muted/20 xl:border-b-0 xl:border-r">
      <div className="shrink-0 px-2 pt-3 pb-3 sm:px-3">
        <p className="mb-2.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Toolkit
        </p>

        <div
          role="tablist"
          aria-label="Toolkit sections"
          className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1"
        >
          {TOOLKIT_TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`toolkit-panel-${id}`}
                id={`toolkit-tab-${id}`}
                onClick={() => setActiveTab(id)}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-md px-1 py-2 text-[10px] leading-tight transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  isActive
                    ? "bg-card font-medium text-foreground ring-1 ring-inset ring-border/70"
                    : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="w-full truncate text-center">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="mx-2 shrink-0 border-b border-border/60 sm:mx-3"
        aria-hidden
      />

      <div
        role="tabpanel"
        id={`toolkit-panel-${activeTab}`}
        aria-labelledby={`toolkit-tab-${activeTab}`}
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2 pt-3 sm:p-3 sm:pt-4 max-h-[280px] xl:max-h-none"
      >
        {activeTab === "templates" && (
          <div className="space-y-2">
            <p className="mb-3 px-1 text-xs text-muted-foreground">
              Jump-start with a battle-tested configuration.
            </p>
            <div className="space-y-1.5">
              {Object.entries(presetLabels).map(([key, { label, description, icon: Icon }]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onApplyPreset(key)}
                  className="flex w-full items-start gap-2.5 rounded-lg border border-border/60 bg-card/50 p-2.5 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold">{label}</div>
                    <div className="line-clamp-2 text-[10px] text-muted-foreground">
                      {description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "saved" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              <Button variant="outline" size="sm" onClick={onSave} className="h-7 gap-1 px-2 text-[10px]">
                <IconDeviceFloppy className="h-3 w-3" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={onReset} className="h-7 gap-1 px-2 text-[10px]">
                <IconRotate className="h-3 w-3" />
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={historyIndex <= 0}
                className="h-7 w-7 p-0"
                title="Undo"
              >
                <IconArrowBackUp className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={historyIndex >= historyLength - 1}
                className="h-7 w-7 p-0"
                title="Redo"
              >
                <IconArrowForwardUp className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm" onClick={onExport} className="h-7 gap-1 px-2 text-[10px]">
                <IconDownload className="h-3 w-3" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={onImport} className="h-7 gap-1 px-2 text-[10px]">
                <IconUpload className="h-3 w-3" />
                Import
              </Button>
            </div>

            {Object.keys(savedConfigs).length === 0 ? (
              <p className="rounded-lg border border-dashed border-border/80 bg-muted/30 px-3 py-6 text-center text-xs text-muted-foreground">
                No saved configs yet. Save your current setup to reuse later.
              </p>
            ) : (
              <div className="space-y-1.5">
                {Object.entries(savedConfigs).map(([name, cfg]) => (
                  <div
                    key={name}
                    className="flex items-center gap-1 rounded-lg border border-border/60 bg-card/50 p-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => onLoad(name)}
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-muted/50"
                    >
                      <IconCode className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-medium">{name}</div>
                        <div className="truncate text-[10px] text-muted-foreground">
                          {cfg.projectType} · {cfg.ciProvider}
                        </div>
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(name)}
                      className="h-7 w-7 shrink-0 p-0"
                    >
                      <IconTrash className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border/60 bg-card/50 p-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold">
                <IconCurrencyDollar className="h-3.5 w-3.5 text-primary" />
                Cost estimate
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="rounded-md bg-muted/50 px-2 py-2">
                  <div className="text-[10px] text-muted-foreground">Minutes/mo</div>
                  <div className="text-sm font-bold">{costEstimate.monthlyMinutes}</div>
                </div>
                <div className="rounded-md bg-muted/50 px-2 py-2">
                  <div className="text-[10px] text-muted-foreground">Est. cost</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ${costEstimate.estimatedCost}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">
                {costEstimate.provider} · {costEstimate.tier}
              </p>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-1.5">
                <p className="px-1 text-xs font-semibold text-muted-foreground">
                  Recommendations
                </p>
                {suggestions.slice(0, 4).map((suggestion, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-2 rounded-md px-2 py-1.5 text-[10px] leading-relaxed",
                      suggestion.type === "warning" &&
                        "bg-orange-500/10 text-orange-800 dark:text-orange-200",
                      suggestion.type === "success" &&
                        "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                      suggestion.type === "info" &&
                        "bg-primary/10 text-foreground/80"
                    )}
                  >
                    {suggestion.type === "warning" && (
                      <IconAlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                    )}
                    {suggestion.type === "success" && (
                      <IconCheck className="mt-0.5 h-3 w-3 shrink-0" />
                    )}
                    {suggestion.type === "info" && (
                      <IconInfoCircle className="mt-0.5 h-3 w-3 shrink-0" />
                    )}
                    <span>{suggestion.message}</span>
                  </div>
                ))}
                {suggestions.length > 4 && (
                  <p className="text-[10px] text-muted-foreground">
                    +{suggestions.length - 4} more suggestions in config
                  </p>
                )}
              </div>
            ) : (
              <p className="px-1 text-xs text-muted-foreground">
                Your pipeline looks solid. Adjust settings to see more tips.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
