"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCurrencyDollar } from "@tabler/icons-react";
import type { CostEstimate } from "../../utils/estimate-cost";

export function CostEstimationCard({ costEstimate }: { costEstimate: CostEstimate }) {
  return (
    <Card>
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <IconCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5" />
          Cost Estimation
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Estimated monthly CI/CD costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <div className="text-xs text-muted-foreground">Provider</div>
              <div className="text-sm font-semibold">{costEstimate.provider}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Tier</div>
              <div className="text-sm font-semibold">{costEstimate.tier}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Monthly Minutes</div>
              <div className="text-lg font-bold">{costEstimate.monthlyMinutes}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Est. Cost</div>
              <div className="text-lg font-bold text-green-600">
                ${costEstimate.estimatedCost}
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground text-center">
            Based on ~50 runs/month • Range: {costEstimate.costRange}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
