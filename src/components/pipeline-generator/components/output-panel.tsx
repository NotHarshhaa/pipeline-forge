"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconCode,
  IconCopy,
  IconDownload,
  IconTerminal2,
} from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import {
  highlightYAML,
  type HighlightTheme,
} from "../utils/highlight-yaml";
import { cn } from "@/lib/utils";

const FILENAME_MAP: Record<PipelineConfig["ciProvider"], string> = {
  "github-actions": ".github/workflows/ci.yml",
  "gitlab-ci": ".gitlab-ci.yml",
  jenkins: "Jenkinsfile",
  circleci: ".circleci/config.yml",
  "azure-pipelines": "azure-pipelines.yml",
};

interface OutputPanelProps {
  config: PipelineConfig;
  output: string;
  copied: boolean;
  onCopy: () => void;
  onDownload: () => void;
  className?: string;
}

export function OutputPanel({
  config,
  output,
  copied,
  onCopy,
  onDownload,
  className,
}: OutputPanelProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const highlightTheme: HighlightTheme =
    mounted && resolvedTheme === "dark" ? "dark" : "light";

  const filename = FILENAME_MAP[config.ciProvider] || "pipeline.yml";
  const lineCount = output ? output.split("\n").length : 0;

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-muted/10 xl:border-l",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2 min-w-0">
          <IconTerminal2 className="h-4 w-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">Live output</p>
            <p className="truncate text-[10px] text-muted-foreground font-mono">
              {filename}
            </p>
          </div>
        </div>
        {output && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Badge variant="secondary" className="hidden sm:inline-flex text-[10px] font-mono">
              {lineCount} lines
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="h-8 gap-1 text-xs"
            >
              {copied ? (
                <IconCheck className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <IconCopy className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-8 gap-1 text-xs"
            >
              <IconDownload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 p-3 sm:p-4 min-h-[320px] lg:min-h-0">
        <div className="terminal-chrome h-full flex flex-col min-h-[280px] lg:min-h-[calc(100vh-16rem)] lg:max-h-[calc(100vh-12rem)]">
          <div className="terminal-titlebar shrink-0">
            <span className="terminal-dot bg-[#ff5f57]" />
            <span className="terminal-dot bg-[#febc2e]" />
            <span className="terminal-dot bg-[#28c840]" />
            <span className="ml-2 truncate font-mono text-[11px] text-muted-foreground dark:text-white/70">
              {filename}
            </span>
          </div>

          {output ? (
            <pre
              className="terminal-code-area code-scrollbar flex-1 overflow-auto p-4 text-xs sm:text-[13px] font-mono leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: `<code>${highlightYAML(output, highlightTheme)}</code>`,
              }}
            />
          ) : (
            <div className="terminal-code-area flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted ring-1 ring-border dark:bg-white/5 dark:ring-white/10">
                <IconCode className="h-7 w-7 text-muted-foreground/60 dark:text-white/40" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground/90 dark:text-white/80">
                  Ready to generate
                </p>
                <p className="mt-1 max-w-[220px] text-xs text-muted-foreground dark:text-white/45">
                  Configure your pipeline on the left, then hit Generate to preview YAML here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
