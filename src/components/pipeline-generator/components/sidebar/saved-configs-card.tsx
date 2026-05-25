"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCode,
  IconDeviceFloppy,
  IconDownload,
  IconRotate,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";

interface SavedConfigsCardProps {
  savedConfigs: Record<string, PipelineConfig>;
  historyIndex: number;
  historyLength: number;
  onSave: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onImport: () => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export function SavedConfigsCard({
  savedConfigs,
  historyIndex,
  historyLength,
  onSave,
  onReset,
  onUndo,
  onRedo,
  onExport,
  onImport,
  onLoad,
  onDelete,
}: SavedConfigsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base sm:text-lg">Saved Configurations</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Save and load your pipeline configurations
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={onSave} className="gap-1.5 text-xs">
              <IconDeviceFloppy className="h-3.5 w-3.5" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={onReset} className="gap-1.5 text-xs">
              <IconRotate className="h-3.5 w-3.5" />
              Reset
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={onUndo}
                disabled={historyIndex <= 0}
                className="gap-1.5 text-xs hidden sm:flex"
                title="Undo (Ctrl+Z)"
              >
                <IconArrowBackUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onRedo}
                disabled={historyIndex >= historyLength - 1}
                className="gap-1.5 text-xs hidden sm:flex"
                title="Redo (Ctrl+Y)"
              >
                <IconArrowForwardUp className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-1.5 text-xs hidden sm:flex"
            >
              <IconDownload className="h-3.5 w-3.5" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onImport}
              className="gap-1.5 text-xs hidden sm:flex"
            >
              <IconUpload className="h-3.5 w-3.5" />
              Import JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      {Object.keys(savedConfigs).length > 0 && (
        <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
          {Object.entries(savedConfigs).map(([name, cfg]) => (
            <div
              key={name}
              className="flex items-center justify-between gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <button
                onClick={() => onLoad(name)}
                className="flex items-center gap-2 flex-1 text-left"
              >
                <IconCode className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{name}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {cfg.projectType} · {cfg.ciProvider}
                  </div>
                </div>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(name)}
                className="h-8 w-8 p-0 shrink-0"
              >
                <IconTrash className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
