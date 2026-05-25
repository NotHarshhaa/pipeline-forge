"use client";

import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import type { ValidationResult } from "@/lib/generate-pipeline";
import { cn } from "@/lib/utils";

interface OutputValidationProps {
  validation: ValidationResult | null;
  className?: string;
}

export function OutputValidation({ validation, className }: OutputValidationProps) {
  if (!validation) return null;

  const { errors, warnings, valid } = validation;
  const hasIssues = errors.length > 0 || warnings.length > 0;

  if (!hasIssues) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs text-emerald-700 dark:text-emerald-400",
          className
        )}
      >
        <IconCircleCheck className="h-4 w-4 shrink-0" />
        <span>YAML looks good — no validation issues found.</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-b px-4 py-2.5 text-xs",
        errors.length > 0
          ? "border-destructive/30 bg-destructive/5 text-destructive"
          : "border-amber-500/30 bg-amber-500/5 text-amber-800 dark:text-amber-300",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="min-w-0 space-y-1.5">
          <p className="font-medium">
            {errors.length > 0
              ? `${errors.length} error${errors.length === 1 ? "" : "s"}`
              : "Validation passed"}
            {warnings.length > 0 &&
              ` · ${warnings.length} warning${warnings.length === 1 ? "" : "s"}`}
            {!valid && errors.length > 0 && " — review before committing"}
          </p>
          <ul className="space-y-0.5 text-[11px] opacity-90">
            {errors.slice(0, 4).map((issue, i) => (
              <li key={`e-${i}`}>
                {issue.line > 0 ? `Line ${issue.line}: ` : ""}
                {issue.message}
              </li>
            ))}
            {warnings.slice(0, 3).map((issue, i) => (
              <li key={`w-${i}`}>
                {issue.line > 0 ? `Line ${issue.line}: ` : ""}
                {issue.message}
              </li>
            ))}
            {errors.length + warnings.length > 7 && (
              <li>…and {errors.length + warnings.length - 7} more</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
