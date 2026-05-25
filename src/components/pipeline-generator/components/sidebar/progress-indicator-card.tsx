"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IconCheck } from "@tabler/icons-react";
import { steps } from "../../constants/options";

interface ProgressIndicatorCardProps {
  currentStep: number;
  expandedSteps: Set<number>;
  onGoToStep: (index: number) => void;
}

export function ProgressIndicatorCard({
  currentStep,
  onGoToStep,
}: ProgressIndicatorCardProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
            Progress
          </span>
          <span className="text-xs sm:text-sm font-semibold">
            {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="flex gap-1">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            return (
              <button
                key={step.id}
                onClick={() => onGoToStep(index)}
                className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isCurrent
                    ? "bg-primary/10 border-2 border-primary"
                    : isCompleted
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/50 dark:border-emerald-500/70"
                      : "bg-muted/30 border-2 border-border hover:border-border/80"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all ${
                    isCurrent
                      ? "bg-primary text-primary-foreground"
                      : isCompleted
                        ? "bg-emerald-600 text-white dark:bg-emerald-500"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <IconCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-medium hidden sm:block ${
                    isCurrent
                      ? "text-primary"
                      : isCompleted
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
