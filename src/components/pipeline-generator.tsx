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
  { value: "gitlab-ci", label: "GitLab CI", icon: IconBrandGitlab, badge: "Coming Soon" },
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
  });
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);

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
    const filename =
      config.ciProvider === "github-actions"
        ? "ci-pipeline.yml"
        : ".gitlab-ci.yml";
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Panel */}
      <div className="space-y-6">
        {/* Project Name */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Project Details</CardTitle>
            <CardDescription>Name your project and select the stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <input
                id="project-name"
                type="text"
                value={config.projectName}
                onChange={(e) => updateConfig("projectName", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="my-awesome-app"
              />
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <div className="grid grid-cols-3 gap-2">
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
                      className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
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
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">CI/CD Provider</CardTitle>
            <CardDescription>Choose your pipeline platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
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
                    className={`relative flex items-center gap-3 rounded-lg border-2 p-4 text-sm font-medium transition-all hover:bg-accent/50 ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {provider.label}
                    {"badge" in provider && (
                      <Badge variant="secondary" className="absolute -top-2 right-2 text-[10px] px-1.5 py-0">
                        {provider.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Options */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Pipeline Steps</CardTitle>
            <CardDescription>Configure what your pipeline does</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "enableLinting" as const, label: "Linting" },
                { key: "enableTests" as const, label: "Tests" },
                { key: "enableBuild" as const, label: "Build" },
                { key: "enableCaching" as const, label: "Caching" },
                { key: "enableSecurityScan" as const, label: "Security Scan" },
                { key: "enableDocker" as const, label: "Docker Build" },
              ].map((opt) => (
                <div key={opt.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={opt.key}
                    checked={config[opt.key]}
                    onCheckedChange={(checked) =>
                      updateConfig(opt.key, checked === true)
                    }
                  />
                  <Label
                    htmlFor={opt.key}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>

            {config.enableDocker && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconBrandDocker className="h-4 w-4 text-primary" />
                    <Label className="text-sm font-semibold">Docker Settings</Label>
                  </div>
                  <input
                    type="text"
                    value={config.dockerImageName || ""}
                    onChange={(e) =>
                      updateConfig("dockerImageName", e.target.value)
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Docker image name (e.g., myapp)"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Deployment */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Deployment</CardTitle>
            <CardDescription>Where should your app be deployed?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label>Target Branches</Label>
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

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full text-base font-semibold gap-2"
        >
          <IconSparkles className="h-5 w-5" />
          Generate Pipeline
        </Button>
      </div>

      {/* Output Panel */}
      <div className="space-y-4">
        <Card className="sticky top-24">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Pipeline</CardTitle>
                <CardDescription>
                  {config.ciProvider === "github-actions"
                    ? ".github/workflows/ci.yml"
                    : ".gitlab-ci.yml"}
                </CardDescription>
              </div>
              {output && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5"
                  >
                    {copied ? (
                      <IconCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <IconCopy className="h-4 w-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-1.5"
                  >
                    <IconDownload className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {output ? (
              <div className="relative">
                <pre className="overflow-auto rounded-lg bg-muted/50 border p-4 text-sm font-mono leading-relaxed max-h-[70vh]">
                  <code>{output}</code>
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center">
                <IconCode className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground font-medium">
                  Configure your pipeline and click Generate
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
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
