"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCheck, IconCode, IconCopy, IconDownload } from "@tabler/icons-react";
import type { PipelineConfig } from "@/lib/generate-pipeline";
import { highlightYAML } from "../utils/highlight-yaml";

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
}

export function OutputPanel({
  config,
  output,
  copied,
  onCopy,
  onDownload,
}: OutputPanelProps) {
  const filename = FILENAME_MAP[config.ciProvider] || "pipeline.yml";

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card className="lg:sticky lg:top-24">
        <CardHeader className="pb-2.5 sm:pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg">Generated Pipeline</CardTitle>
              <CardDescription className="text-xs sm:text-sm truncate">
                {filename}
              </CardDescription>
            </div>
            {output && (
              <div className="flex gap-1.5 sm:gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCopy}
                  className="gap-1 sm:gap-1.5 text-xs sm:text-sm"
                >
                  {copied ? (
                    <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                  ) : (
                    <IconCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  )}
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDownload}
                  className="gap-1 sm:gap-1.5 text-xs sm:text-sm"
                >
                  <IconDownload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {output ? (
            <div className="relative">
              <pre
                className="code-scrollbar overflow-auto rounded-lg bg-muted/50 border p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]"
                dangerouslySetInnerHTML={{
                  __html: `<code>${highlightYAML(output)}</code>`,
                }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 sm:p-12 text-center">
              <IconCode className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground font-medium">
                Configure your pipeline and click Generate
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                Your YAML output will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
