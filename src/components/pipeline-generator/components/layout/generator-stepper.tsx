"use client";

import { IconCheck } from "@tabler/icons-react";
import { steps } from "../../constants/options";
import { cn } from "@/lib/utils";

interface GeneratorStepperProps {
  currentStep: number;
  onGoToStep: (index: number) => void;
}

export function GeneratorStepper({ currentStep, onGoToStep }: GeneratorStepperProps) {
  return (
    <nav
      aria-label="Pipeline configuration steps"
      className="min-w-0 shrink-0 border-b bg-muted/30"
    >
      <div className="stepper-scrollbar overflow-x-auto overscroll-x-contain pb-1">
        <ol className="flex min-w-max items-center gap-0.5 px-3 py-3 sm:gap-1 sm:px-4 sm:py-3.5 lg:px-5">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <li key={step.id} className="flex shrink-0 items-center">
                <button
                  type="button"
                  onClick={() => onGoToStep(index)}
                  className={cn(
                    "flex max-w-[200px] items-center gap-2 rounded-lg px-2 py-1.5 transition-colors sm:px-2.5 sm:py-2",
                    isCurrent && "border border-primary/30 bg-primary/10",
                    !isCurrent && "border border-transparent hover:bg-muted/60"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8",
                      isCurrent && "bg-primary text-primary-foreground",
                      isCompleted && !isCurrent && "bg-emerald-600 text-white dark:bg-emerald-500",
                      !isCurrent && !isCompleted && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    ) : (
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                  </span>
                  <span className="hidden min-w-0 flex-col items-start text-left xl:flex">
                    <span
                      className={cn(
                        "text-[10px] font-medium uppercase tracking-wider",
                        isCurrent ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      Step {index + 1}
                    </span>
                    <span
                      className={cn(
                        "truncate text-xs font-semibold",
                        isCurrent ? "text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </span>
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-0.5 h-px w-3 shrink-0 sm:mx-1 sm:w-6",
                      index < currentStep ? "bg-emerald-500/60" : "bg-border"
                    )}
                    aria-hidden
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
