"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import type { Suggestion } from "../../utils/analyze-best-practices";

export function BestPracticesCard({ suggestions }: { suggestions: Suggestion[] }) {
  if (suggestions.length === 0) return null;

  return (
    <Card
      className={
        suggestions.some((s) => s.type === "warning")
          ? "border-orange-200 dark:border-orange-900"
          : ""
      }
    >
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <IconInfoCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          Best Practices
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Recommendations for your pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 p-2 rounded-lg ${
              suggestion.type === "warning"
                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200"
                : suggestion.type === "success"
                  ? "bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200"
                  : "bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200"
            }`}
          >
            {suggestion.type === "warning" && (
              <IconAlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            {suggestion.type === "success" && (
              <IconCheck className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            {suggestion.type === "info" && (
              <IconInfoCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span className="text-xs sm:text-sm">{suggestion.message}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
