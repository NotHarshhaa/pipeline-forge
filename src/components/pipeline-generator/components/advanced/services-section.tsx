"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconDatabase } from "@tabler/icons-react";
import type { AdvancedSectionProps } from "./types";

export function ServicesSection({ config, updateConfig }: AdvancedSectionProps) {
  return (
    <div className="space-y-1.5 sm:space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          id="services"
          checked={config.services?.enabled}
          onCheckedChange={(checked) =>
            updateConfig("services", {
              ...config.services!,
              enabled: checked as boolean,
            })
          }
        />
        <Label htmlFor="services" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
          <IconDatabase className="h-4 w-4" />
          Database & Services
        </Label>
      </div>
      {config.services?.enabled && (
        <div className="ml-6 space-y-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="database"
                checked={config.services?.database?.enabled}
                onCheckedChange={(checked) =>
                  updateConfig("services", {
                    ...config.services!,
                    database: {
                      ...config.services!.database!,
                      enabled: checked as boolean,
                    },
                  })
                }
              />
              <Label htmlFor="database" className="text-xs cursor-pointer">
                Database
              </Label>
            </div>
            {config.services?.database?.enabled && (
              <div className="ml-6 space-y-2">
                <Select
                  value={config.services?.database?.type || "postgresql"}
                  onValueChange={(value) =>
                    updateConfig("services", {
                      ...config.services!,
                      database: {
                        ...config.services!.database!,
                        type: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                    <SelectItem value="redis">Redis</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="migrations"
                    checked={config.services?.database?.migrations}
                    onCheckedChange={(checked) =>
                      updateConfig("services", {
                        ...config.services!,
                        database: {
                          ...config.services!.database!,
                          migrations: checked as boolean,
                        },
                      })
                    }
                  />
                  <Label htmlFor="migrations" className="text-xs cursor-pointer">
                    Run migrations
                  </Label>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="redis"
              checked={config.services?.redis}
              onCheckedChange={(checked) =>
                updateConfig("services", {
                  ...config.services!,
                  redis: checked as boolean,
                })
              }
            />
            <Label htmlFor="redis" className="text-xs cursor-pointer">
              Redis cache
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="elasticsearch"
              checked={config.services?.elasticsearch}
              onCheckedChange={(checked) =>
                updateConfig("services", {
                  ...config.services!,
                  elasticsearch: checked as boolean,
                })
              }
            />
            <Label htmlFor="elasticsearch" className="text-xs cursor-pointer">
              Elasticsearch
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
