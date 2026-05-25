"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconClock } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function ScheduleSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="schedule"
          checked={config.schedule?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("schedule", {
              ...config.schedule!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="schedule" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconClock className="h-4 w-4" />
          Scheduled Pipelines
        </Label>
      </div>
      {config.schedule?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Cron expression (e.g., 0 2 * * *)
            </Label>
            <Input
              placeholder="0 2 * * * (daily at 2 AM)"
              value={config.schedule?.cron || ""}
              onChange={(e) =>
                updateConfig("schedule", {
                  ...config.schedule!,
                  cron: e.target.value,
                })
              }
              className="text-xs h-8 font-mono"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Timezone</Label>
            <Select
              value={config.schedule?.timezone || "UTC"}
              onValueChange={(value) =>
                updateConfig("schedule", {
                  ...config.schedule!,
                  timezone: value,
                })
              }
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
