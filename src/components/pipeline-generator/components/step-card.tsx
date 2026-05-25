"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface StepCardProps {
  stepIndex: number;
  stepNumber: number;
  title: string;
  description: string;
  optional?: boolean;
  currentStep: number;
  expandedSteps: Set<number>;
  onToggle: () => void;
  contentClassName?: string;
  children: React.ReactNode;
}

export function StepCard({
  stepIndex,
  stepNumber,
  title,
  description,
  optional,
  currentStep,
  expandedSteps,
  onToggle,
  contentClassName = "space-y-3 sm:space-y-4",
  children,
}: StepCardProps) {
  const isExpanded = expandedSteps.has(stepIndex);
  const isCompleted = currentStep > stepIndex;
  const isCurrent = currentStep === stepIndex;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 bg-card/80 shadow-sm transition-all duration-200",
        isExpanded && isCurrent && "border-primary/40 ring-1 ring-primary/15 shadow-md",
        isExpanded && isCompleted && "border-emerald-500/30",
        !isExpanded && "hover:border-border hover:shadow"
      )}
    >
      <CardHeader className="p-0">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/30 sm:px-5 sm:py-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-all sm:h-10 sm:w-10",
                isCurrent && "bg-primary text-primary-foreground shadow-sm",
                isCompleted && !isCurrent && "bg-emerald-600 text-white dark:bg-emerald-500",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                stepNumber
              )}
            </div>
            <div className="min-w-0">
              <CardTitle className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                {title}
                {optional && (
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    Optional
                  </Badge>
                )}
                {isCompleted && !optional && (
                  <Badge
                    variant="secondary"
                    className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-400"
                  >
                    Done
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="mt-0.5 text-xs line-clamp-1">
                {description}
              </CardDescription>
            </div>
          </div>
          {isExpanded ? (
            <IconChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
          ) : (
            <IconChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent className={cn("border-t bg-muted/10 px-4 pb-4 pt-4 sm:px-5 sm:pb-5", contentClassName)}>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
