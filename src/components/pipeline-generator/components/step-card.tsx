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
      className={
        isExpanded
          ? isCompleted
            ? "border-emerald-500/50 dark:border-emerald-500/70"
            : "border-primary"
          : ""
      }
    >
      <CardHeader className="pb-2 sm:pb-4">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left group"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isCompleted
                    ? "bg-emerald-600 text-white dark:bg-emerald-500"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? (
                <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <span className="text-sm font-semibold">{stepNumber}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                {title}
                {optional && (
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">
                    Optional
                  </Badge>
                )}
                {isCompleted && !optional && (
                  <Badge variant="secondary" className="text-[10px]">
                    Completed
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                {description}
              </CardDescription>
            </div>
          </div>
          {isExpanded ? (
            <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          ) : (
            <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </button>
      </CardHeader>
      {isExpanded && (
        <CardContent className={contentClassName}>{children}</CardContent>
      )}
    </Card>
  );
}
