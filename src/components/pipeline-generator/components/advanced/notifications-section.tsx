"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { IconBell } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function NotificationsSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="notifications"
          checked={config.notifications?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("notifications", {
              ...config.notifications!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="notifications" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconBell className="h-4 w-4" />
          Enable Notifications
        </Label>
      </div>
    
      {config.notifications?.enabled && (
        <div className="ml-6 space-y-3 pt-2">
          {/* Slack */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="slack"
                checked={config.notifications?.slack?.enabled}
                onCheckedChange={(checked) =>
                  updateConfig("notifications", {
                    ...config.notifications!,
                    slack: {
                      ...config.notifications!.slack,
                      enabled: checked as boolean,
                    },
                  })
                }
              />
              <Label htmlFor="slack" className="text-xs cursor-pointer">
                Slack Notifications
              </Label>
            </div>
            {config.notifications?.slack?.enabled && (
              <Input
                placeholder="Slack webhook URL"
                value={config.notifications?.slack?.webhookUrl || ""}
                onChange={(e) =>
                  updateConfig("notifications", {
                    ...config.notifications!,
                    slack: {
                      ...config.notifications!.slack!,
                      webhookUrl: e.target.value,
                    },
                  })
                }
                className="text-xs h-8"
              />
            )}
          </div>
    
          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="email"
                checked={config.notifications?.email?.enabled}
                onCheckedChange={(checked) =>
                  updateConfig("notifications", {
                    ...config.notifications!,
                    email: {
                      ...config.notifications!.email,
                      enabled: checked as boolean,
                    },
                  })
                }
              />
              <Label htmlFor="email" className="text-xs cursor-pointer">
                Email Notifications
              </Label>
            </div>
            {config.notifications?.email?.enabled && (
              <Input
                placeholder="Email addresses (comma-separated)"
                value={config.notifications?.email?.recipients || ""}
                onChange={(e) =>
                  updateConfig("notifications", {
                    ...config.notifications!,
                    email: {
                      ...config.notifications!.email!,
                      recipients: e.target.value,
                    },
                  })
                }
                className="text-xs h-8"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
