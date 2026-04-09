"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IconBrandNodejs,
  IconBrandPython,
  IconBrandGolang,
  IconBrandRust,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandDocker,
  IconBrandAws,
  IconCopy,
  IconDownload,
  IconCheck,
  IconSparkles,
  IconCode,
  IconBrandJavascript,
  IconServer,
  IconRefresh,
  IconCloud,
  IconPlus,
  IconTrash,
  IconSettings,
  IconChevronDown,
  IconChevronUp,
  IconBell,
  IconVariable,
  IconTerminal,
} from "@tabler/icons-react";
import { generatePipeline, type PipelineConfig } from "@/lib/generate-pipeline";

const projectTypes = [
  { value: "nodejs", label: "Node.js", icon: IconBrandNodejs },
  { value: "python", label: "Python", icon: IconBrandPython },
  { value: "java", label: "Java", icon: IconBrandJavascript },
  { value: "go", label: "Go", icon: IconBrandGolang },
  { value: "rust", label: "Rust", icon: IconBrandRust },
  { value: "dotnet", label: ".NET", icon: IconCode },
] as const;

const ciProviders = [
  { value: "github-actions", label: "GitHub Actions", icon: IconBrandGithub },
  { value: "gitlab-ci", label: "GitLab CI", icon: IconBrandGitlab },
  { value: "jenkins", label: "Jenkins", icon: IconServer },
  { value: "circleci", label: "CircleCI", icon: IconRefresh },
  { value: "azure-pipelines", label: "Azure Pipelines", icon: IconCloud },
] as const;

const deployTargets = [
  { value: "none", label: "No Deployment" },
  { value: "aws", label: "AWS (ECS)", icon: IconBrandAws },
  { value: "kubernetes", label: "Kubernetes" },
] as const;

export function PipelineGenerator() {
  const [config, setConfig] = useState<PipelineConfig>({
    projectName: "my-app",
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    enableDocker: false,
    dockerImageName: "",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    deployTarget: "none",
    branches: ["main"],
    enableCaching: true,
    enableSecurityScan: false,
    environmentVariables: [],
    customScripts: {},
    notifications: {
      enabled: false,
      slack: { enabled: false },
      email: { enabled: false },
    },
  });
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = useCallback(() => {
    const yaml = generatePipeline(config);
    setOutput(yaml);
  }, [config]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const filenameMap: Record<PipelineConfig["ciProvider"], string> = {
      "github-actions": ".github/workflows/ci.yml",
      "gitlab-ci": ".gitlab-ci.yml",
      "jenkins": "Jenkinsfile",
      "circleci": ".circleci/config.yml",
      "azure-pipelines": "azure-pipelines.yml",
    };
    const filename = filenameMap[config.ciProvider] || "pipeline.yml";
    const blob = new Blob([output], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, config.ciProvider]);

  const updateConfig = <K extends keyof PipelineConfig>(
    key: K,
    value: PipelineConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Configuration Panel */}
      <div className="space-y-4 sm:space-y-6">
        {/* Project Name */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Project Details</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Name your project and select the stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="project-name" className="text-sm">Project Name</Label>
              <input
                id="project-name"
                type="text"
                value={config.projectName}
                onChange={(e) => updateConfig("projectName", e.target.value)}
                className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="my-awesome-app"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Project Type</Label>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = config.projectType === type.value;
                  return (
                    <button
                      key={type.value}
                      onClick={() =>
                        updateConfig(
                          "projectType",
                          type.value as PipelineConfig["projectType"]
                        )
                      }
                      className={`flex flex-col items-center gap-1 sm:gap-1.5 rounded-lg border-2 p-2 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CI Provider */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">CI/CD Provider</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Choose your pipeline platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {ciProviders.map((provider) => {
                const Icon = provider.icon;
                const isSelected = config.ciProvider === provider.value;
                return (
                  <button
                    key={provider.value}
                    onClick={() =>
                      updateConfig(
                        "ciProvider",
                        provider.value as PipelineConfig["ciProvider"]
                      )
                    }
                    className={`relative flex flex-col items-center gap-1.5 sm:gap-2 rounded-lg border-2 p-2.5 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-center leading-tight">{provider.label}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Options */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Pipeline Steps</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Configure what your pipeline does</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: "enableLinting" as const, label: "Linting" },
                { key: "enableTests" as const, label: "Tests" },
                { key: "enableBuild" as const, label: "Build" },
                { key: "enableCaching" as const, label: "Caching" },
                { key: "enableSecurityScan" as const, label: "Security Scan" },
                { key: "enableDocker" as const, label: "Docker Build" },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center space-x-1.5 sm:space-x-2">
                  <Checkbox
                    id={opt.key}
                    checked={config[opt.key]}
                    onCheckedChange={(checked) =>
                      updateConfig(opt.key, checked === true)
                    }
                  />
                  <Label
                    htmlFor={opt.key}
                    className="text-xs sm:text-sm font-medium cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>

            {config.enableDocker && (
              <>
                <Separator />
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <IconBrandDocker className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    <Label className="text-xs sm:text-sm font-semibold">Docker Settings</Label>
                  </div>
                  <input
                    type="text"
                    value={config.dockerImageName || ""}
                    onChange={(e) =>
                      updateConfig("dockerImageName", e.target.value)
                    }
                    className="flex h-8 sm:h-9 w-full rounded-md border border-input bg-background px-2.5 sm:px-3 py-1 text-xs sm:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Docker image name (e.g., myapp)"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Deployment */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Deployment</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Where should your app be deployed?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Select
              value={config.deployTarget}
              onValueChange={(v) =>
                updateConfig("deployTarget", v as PipelineConfig["deployTarget"])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select deployment target" />
              </SelectTrigger>
              <SelectContent>
                {deployTargets.map((target) => (
                  <SelectItem key={target.value} value={target.value}>
                    <span className="flex items-center gap-2">
                      {"icon" in target && target.icon && (
                        <target.icon className="h-4 w-4" />
                      )}
                      {target.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Target Branches</Label>
              <Select
                value={config.branches[0]}
                onValueChange={(v) => updateConfig("branches", [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="master">master</SelectItem>
                  <SelectItem value="develop">develop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <IconSettings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Advanced Features
                  <Badge variant="secondary" className="text-[10px] sm:text-xs">New</Badge>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Environment variables, custom scripts, and notifications
                </CardDescription>
              </div>
              {showAdvanced ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>
          
          {showAdvanced && (
            <CardContent className="space-y-4 sm:space-y-5">
              {/* Environment Variables */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <IconVariable className="h-4 w-4" />
                    Environment Variables
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newVars = [...(config.environmentVariables || []), { key: "", value: "" }];
                      updateConfig("environmentVariables", newVars);
                    }}
                    className="h-7 text-xs gap-1"
                  >
                    <IconPlus className="h-3 w-3" />
                    Add
                  </Button>
                </div>
                {config.environmentVariables && config.environmentVariables.length > 0 ? (
                  <div className="space-y-2">
                    {config.environmentVariables.map((env, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="KEY"
                          value={env.key}
                          onChange={(e) => {
                            const newVars = [...config.environmentVariables!];
                            newVars[index].key = e.target.value;
                            updateConfig("environmentVariables", newVars);
                          }}
                          className="flex-1 h-8 text-xs"
                        />
                        <Input
                          placeholder="value"
                          value={env.value}
                          onChange={(e) => {
                            const newVars = [...config.environmentVariables!];
                            newVars[index].value = e.target.value;
                            updateConfig("environmentVariables", newVars);
                          }}
                          className="flex-1 h-8 text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newVars = config.environmentVariables!.filter((_, i) => i !== index);
                            updateConfig("environmentVariables", newVars);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <IconTrash className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No environment variables added</p>
                )}
              </div>

              <Separator />

              {/* Custom Scripts */}
              <div className="space-y-2 sm:space-y-3">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <IconTerminal className="h-4 w-4" />
                  Custom Scripts
                </Label>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Pre-Build Script</Label>
                    <Textarea
                      placeholder="Commands to run before build (e.g., echo 'Starting build')"
                      value={config.customScripts?.preBuild || ""}
                      onChange={(e) =>
                        updateConfig("customScripts", {
                          ...config.customScripts,
                          preBuild: e.target.value,
                        })
                      }
                      className="text-xs font-mono min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Pre-Test Script</Label>
                    <Textarea
                      placeholder="Commands to run before tests (e.g., npm run db:seed)"
                      value={config.customScripts?.preTest || ""}
                      onChange={(e) =>
                        updateConfig("customScripts", {
                          ...config.customScripts,
                          preTest: e.target.value,
                        })
                      }
                      className="text-xs font-mono min-h-[60px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Post-Build Script</Label>
                    <Textarea
                      placeholder="Commands to run after build (e.g., npm run analyze)"
                      value={config.customScripts?.postBuild || ""}
                      onChange={(e) =>
                        updateConfig("customScripts", {
                          ...config.customScripts,
                          postBuild: e.target.value,
                        })
                      }
                      className="text-xs font-mono min-h-[60px]"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-2 sm:space-y-3">
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
            </CardContent>
          )}
        </Card>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full text-sm sm:text-base font-semibold gap-2"
        >
          <IconSparkles className="h-4 w-4 sm:h-5 sm:w-5" />
          Generate Pipeline
        </Button>
      </div>

      {/* Output Panel */}
      <div className="space-y-3 sm:space-y-4">
        <Card className="lg:sticky lg:top-24">
          <CardHeader className="pb-2.5 sm:pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg">Generated Pipeline</CardTitle>
                <CardDescription className="text-xs sm:text-sm truncate">
                  {(() => {
                    const filenameMap: Record<PipelineConfig["ciProvider"], string> = {
                      "github-actions": ".github/workflows/ci.yml",
                      "gitlab-ci": ".gitlab-ci.yml",
                      "jenkins": "Jenkinsfile",
                      "circleci": ".circleci/config.yml",
                      "azure-pipelines": "azure-pipelines.yml",
                    };
                    return filenameMap[config.ciProvider] || "pipeline.yml";
                  })()}
                </CardDescription>
              </div>
              {output && (
                <div className="flex gap-1.5 sm:gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1 sm:gap-1.5 text-xs sm:text-sm"
                  >
                    {copied ? (
                      <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                    ) : (
                      <IconCopy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    )}
                    <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-1 sm:gap-1.5 text-xs sm:text-sm"
                  >
                    <IconDownload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="relative">
                <pre className="overflow-auto rounded-lg bg-muted/50 border p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]">
                  <code>{output}</code>
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 sm:p-12 text-center">
                <IconCode className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/50 mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-muted-foreground font-medium">
                  Configure your pipeline and click Generate
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/70 mt-1">
                  Your YAML output will appear here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
