"use client";

import { useState, useCallback, useEffect } from "react";
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
  IconChevronRight,
  IconBell,
  IconVariable,
  IconTerminal,
  IconGitBranch,
  IconPackage,
  IconClock,
  IconChartBar,
  IconRocket,
  IconDatabase,
  IconBrandVercel,
  IconWorld,
  IconBrandAzure,
  IconBrandGoogle,
  IconCloudOff,
  IconBrandDocker as IconKubernetes,
  IconWorldWww,
  IconDeviceFloppy,
  IconUpload,
  IconRotate,
  IconTemplate,
  IconArrowBackUp,
  IconArrowForwardUp,
  IconAlertTriangle,
  IconInfoCircle,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { generatePipeline, type PipelineConfig } from "@/lib/generate-pipeline";

// Simple YAML syntax highlighter
function highlightYAML(yaml: string): string {
  let highlighted = yaml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments
  highlighted = highlighted.replace(/^(\s*)#.*$/gm, '$1<span class="text-muted-foreground italic">$&</span>');
  
  // Keys (before colon)
  highlighted = highlighted.replace(/^(\s*)([\w\-]+):/gm, '$1<span class="text-blue-500 font-semibold">$2</span>:');
  
  // String values in quotes
  highlighted = highlighted.replace(/: ("[^"]*")/g, ': <span class="text-green-600">$1</span>');
  highlighted = highlighted.replace(/: ('[^']*')/g, ': <span class="text-green-600">$1</span>');
  
  // Numbers
  highlighted = highlighted.replace(/: (\d+)/g, ': <span class="text-orange-500">$1</span>');
  
  // Boolean values
  highlighted = highlighted.replace(/: (true|false)/g, ': <span class="text-purple-600">$1</span>');
  
  // Special YAML characters
  highlighted = highlighted.replace(/(\${{[^}]+}})/g, '<span class="text-yellow-600">$1</span>');
  
  // YAML anchors and aliases
  highlighted = highlighted.replace(/(&[\w\-]+)/g, '<span class="text-pink-500">$1</span>');
  highlighted = highlighted.replace(/(\*[\w\-]+)/g, '<span class="text-pink-500">$1</span>');
  
  return highlighted;
}

// Preset configurations for common use cases
const presets: Record<string, Partial<PipelineConfig>> = {
  "basic-nodejs": {
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    packageManager: "npm",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    enableCaching: true,
    deployTarget: "none",
    ciSettings: { concurrency: 1, timeout: 60, retryOnFailure: false, parallelJobs: false },
  },
  "production-nodejs": {
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    packageManager: "npm",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    enableCaching: true,
    enableSecurityScan: true,
    enableDependencyAudit: true,
    enableCodeFormatting: true,
    enableTypeChecking: true,
    deployTarget: "vercel",
    ciSettings: { concurrency: 2, timeout: 60, retryOnFailure: true, parallelJobs: true },
    notifications: { enabled: true, slack: { enabled: false }, email: { enabled: false } },
  },
  "python-api": {
    projectType: "python",
    ciProvider: "github-actions",
    pythonVersion: "3.12",
    packageManager: "pip",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    enableCaching: true,
    enableSecurityScan: true,
    enableDependencyAudit: true,
    deployTarget: "none",
    ciSettings: { concurrency: 1, timeout: 60, retryOnFailure: false, parallelJobs: false },
  },
  "docker-k8s": {
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    packageManager: "npm",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    enableCaching: true,
    enableDocker: true,
    enableContainerScan: true,
    deployTarget: "kubernetes",
    ciSettings: { concurrency: 2, timeout: 90, retryOnFailure: true, parallelJobs: true },
  },
  "full-featured": {
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    packageManager: "npm",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    enableCaching: true,
    enableSecurityScan: true,
    enableDependencyAudit: true,
    enableCodeFormatting: true,
    enableTypeChecking: true,
    enableE2ETesting: true,
    enableDocker: true,
    enableContainerScan: true,
    enableSonarQube: true,
    deployTarget: "aws",
    ciSettings: { concurrency: 3, timeout: 120, retryOnFailure: true, parallelJobs: true },
    notifications: { enabled: true, slack: { enabled: true }, email: { enabled: true } },
    matrixBuild: { enabled: true, versions: ["18", "20", "22"] },
    artifacts: { enabled: true, paths: ["dist/", "build/"], retention: 30 },
    codeQuality: { enabled: true, coverageThreshold: 80, qualityGate: true },
  },
};

const presetLabels: Record<string, { label: string; description: string; icon: any }> = {
  "basic-nodejs": { label: "Basic Node.js", description: "Simple setup with tests, linting & build", icon: IconBrandNodejs },
  "production-nodejs": { label: "Production Node.js", description: "Full-featured with security & deployment", icon: IconRocket },
  "python-api": { label: "Python API", description: "Python with security scanning", icon: IconBrandPython },
  "docker-k8s": { label: "Docker + K8s", description: "Containerized with Kubernetes deployment", icon: IconBrandDocker },
  "full-featured": { label: "Full Featured", description: "All features enabled for enterprise", icon: IconSparkles },
};

// Best practices analyzer
interface Suggestion {
  type: 'warning' | 'info' | 'success';
  message: string;
}

function analyzeBestPractices(config: PipelineConfig): Suggestion[] {
  const suggestions: Suggestion[] = [];
  
  // Security checks
  if (!config.enableSecurityScan) {
    suggestions.push({
      type: 'warning',
      message: 'Consider enabling security scanning to detect vulnerabilities'
    });
  }
  
  if (!config.enableDependencyAudit) {
    suggestions.push({
      type: 'warning',
      message: 'Dependency audit helps identify vulnerable packages'
    });
  }
  
  if (config.enableDocker && !config.enableContainerScan) {
    suggestions.push({
      type: 'warning',
      message: 'Container scanning is recommended for Docker builds'
    });
  }
  
  // Code quality checks
  if (!config.enableCodeFormatting) {
    suggestions.push({
      type: 'info',
      message: 'Code formatting ensures consistent style across the team'
    });
  }
  
  if ((config.projectType === 'nodejs' || config.projectType === 'python') && !config.enableTypeChecking) {
    suggestions.push({
      type: 'info',
      message: 'Type checking catches bugs before runtime'
    });
  }
  
  // Performance checks
  if (!config.enableCaching) {
    suggestions.push({
      type: 'warning',
      message: 'Caching significantly speeds up build times'
    });
  }
  
  if (!config.ciSettings?.parallelJobs && (config.enableTests || config.enableLinting)) {
    suggestions.push({
      type: 'info',
      message: 'Parallel jobs can reduce pipeline execution time'
    });
  }
  
  // Deployment checks
  if (config.deployTarget !== 'none' && !config.enableTests) {
    suggestions.push({
      type: 'warning',
      message: 'Running tests before deployment is highly recommended'
    });
  }
  
  // Success messages
  if (config.enableSecurityScan && config.enableDependencyAudit && config.enableCaching) {
    suggestions.push({
      type: 'success',
      message: 'Great! Your pipeline has essential security and performance features'
    });
  }
  
  if (config.codeQuality?.enabled && config.codeQuality?.qualityGate) {
    suggestions.push({
      type: 'success',
      message: 'Quality gates ensure code standards are met'
    });
  }
  
  return suggestions;
}

// Pipeline cost estimator
interface CostEstimate {
  monthlyMinutes: number;
  estimatedCost: number;
  costRange: string;
  provider: string;
  tier: string;
}

function estimatePipelineCost(config: PipelineConfig): CostEstimate {
  // Base assumptions (adjust based on typical usage)
  const runsPerMonth = 50; // Average 50 pipeline runs per month
  const baseMinutesPerRun = 5; // Base time per run
  
  // Calculate complexity multiplier based on features
  let complexityMultiplier = 1;
  
  if (config.enableTests) complexityMultiplier += 0.3;
  if (config.enableE2ETesting) complexityMultiplier += 0.5;
  if (config.enableBuild) complexityMultiplier += 0.4;
  if (config.enableSecurityScan) complexityMultiplier += 0.3;
  if (config.enableDocker) complexityMultiplier += 0.5;
  if (config.enableSonarQube) complexityMultiplier += 0.4;
  if (config.matrixBuild?.enabled && config.matrixBuild.versions) complexityMultiplier += config.matrixBuild.versions.length * 0.5;
  if (config.performance?.enabled) complexityMultiplier += 0.4;
  if (config.services?.enabled) complexityMultiplier += 0.3;
  
  // Timeout adjustment
  const timeoutMultiplier = (config.ciSettings?.timeout || 60) / 60;
  
  const minutesPerRun = baseMinutesPerRun * complexityMultiplier * timeoutMultiplier;
  const monthlyMinutes = Math.round(runsPerMonth * minutesPerRun);
  
  // Provider-specific pricing (simplified estimates)
  let costPerMinute = 0.008; // GitHub Actions default
  let provider = 'GitHub Actions';
  let tier = 'Free Tier';
  
  switch (config.ciProvider) {
    case 'github-actions':
      costPerMinute = 0.008;
      provider = 'GitHub Actions';
      if (monthlyMinutes > 2000) {
        tier = 'Pro ($4/500 min)';
      }
      break;
    case 'gitlab-ci':
      costPerMinute = 0.014;
      provider = 'GitLab CI';
      if (monthlyMinutes > 400) {
        tier = 'Paid ($20/1000 min)';
      }
      break;
    case 'circleci':
      costPerMinute = 0.01;
      provider = 'CircleCI';
      if (monthlyMinutes > 6000) {
        tier = 'Performance ($15/1000 min)';
      }
      break;
    case 'azure-pipelines':
      costPerMinute = 0.006;
      provider = 'Azure Pipelines';
      if (monthlyMinutes > 1800) {
        tier = 'Paid ($40/1800 min)';
      }
      break;
    case 'jenkins':
      costPerMinute = 0.005; // Self-hosted, lower cost
      provider = 'Jenkins (Self-hosted)';
      tier = 'Infrastructure costs apply';
      break;
  }
  
  const estimatedCost = Math.round(monthlyMinutes * costPerMinute);
  
  // Create cost range
  const minCost = Math.round(estimatedCost * 0.7);
  const maxCost = Math.round(estimatedCost * 1.3);
  const costRange = `$${minCost} - $${maxCost}`;
  
  return {
    monthlyMinutes,
    estimatedCost,
    costRange,
    provider,
    tier,
  };
}

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
  { value: "none", label: "No Deployment", icon: IconCloudOff },
  { value: "aws", label: "AWS (ECS)", icon: IconBrandAws },
  { value: "kubernetes", label: "Kubernetes", icon: IconKubernetes },
  { value: "vercel", label: "Vercel", icon: IconBrandVercel },
  { value: "netlify", label: "Netlify", icon: IconWorld },
  { value: "heroku", label: "Heroku", icon: IconWorldWww },
  { value: "azure", label: "Azure App Service", icon: IconBrandAzure },
  { value: "gcp", label: "Google Cloud Platform", icon: IconBrandGoogle },
] as const;

// Step configuration
const steps = [
  { id: 'project', title: 'Project Details', icon: IconSettings },
  { id: 'provider', title: 'CI/CD Provider', icon: IconBrandGithub },
  { id: 'pipeline', title: 'Pipeline Steps', icon: IconTerminal },
  { id: 'deployment', title: 'Deployment', icon: IconCloud },
  { id: 'advanced', title: 'Advanced Features', icon: IconSettings },
] as const;

export function PipelineGenerator() {
  const [config, setConfig] = useState<PipelineConfig>({
    projectName: "my-app",
    projectType: "nodejs",
    ciProvider: "github-actions",
    nodeVersion: "20",
    packageManager: "npm",
    isMonorepo: false,
    monorepoTool: "none",
    workingDirectory: ".",
    enableDocker: false,
    dockerImageName: "",
    enableTests: true,
    enableLinting: true,
    enableBuild: true,
    deployTarget: "none",
    branches: ["main"],
    enableCaching: true,
    enableSecurityScan: false,
    enableE2ETesting: false,
    enableCodeFormatting: false,
    enableTypeChecking: false,
    enableDependencyAudit: false,
    enableContainerScan: false,
    enableSonarQube: false,
    ciSettings: {
      concurrency: 1,
      timeout: 60,
      retryOnFailure: false,
      parallelJobs: false,
    },
    environmentVariables: [],
    customScripts: {},
    notifications: {
      enabled: false,
      slack: { enabled: false },
      email: { enabled: false },
    },
    matrixBuild: {
      enabled: false,
      versions: [],
    },
    artifacts: {
      enabled: false,
      paths: [],
      retention: 30,
    },
    schedule: {
      enabled: false,
      cron: "",
      timezone: "UTC",
    },
    codeQuality: {
      enabled: false,
      coverageThreshold: 80,
      qualityGate: false,
    },
    performance: {
      enabled: false,
      loadTesting: false,
      benchmarks: false,
    },
    services: {
      enabled: false,
      database: {
        enabled: false,
        type: "postgresql",
        migrations: false,
      },
      redis: false,
      elasticsearch: false,
    },
  });
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, PipelineConfig>>({});
  const [currentConfigName, setCurrentConfigName] = useState<string>("");
  const [history, setHistory] = useState<PipelineConfig[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));
  const suggestions = analyzeBestPractices(config);
  const costEstimate = estimatePipelineCost(config);

  // Load saved configs from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pipeline-forge-configs');
    if (saved) {
      try {
        setSavedConfigs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved configs:', e);
      }
    }
    // Initialize history with default config
    setHistory([config]);
    setHistoryIndex(0);
  }, []);

  // Auto-save current config to localStorage
  useEffect(() => {
    if (currentConfigName) {
      const updated = { ...savedConfigs, [currentConfigName]: config };
      setSavedConfigs(updated);
      localStorage.setItem('pipeline-forge-configs', JSON.stringify(updated));
    }
  }, [config, currentConfigName]);

  const handleSaveConfig = useCallback(() => {
    const name = prompt('Enter a name for this configuration:', currentConfigName || 'my-config');
    if (name) {
      const updated = { ...savedConfigs, [name]: config };
      setSavedConfigs(updated);
      localStorage.setItem('pipeline-forge-configs', JSON.stringify(updated));
      setCurrentConfigName(name);
    }
  }, [config, savedConfigs, currentConfigName]);

  const handleLoadConfig = useCallback((name: string) => {
    const loaded = savedConfigs[name];
    if (loaded) {
      setConfig(loaded);
      setCurrentConfigName(name);
    }
  }, [savedConfigs]);

  const handleDeleteConfig = useCallback((name: string) => {
    if (confirm(`Delete configuration "${name}"?`)) {
      const updated = { ...savedConfigs };
      delete updated[name];
      setSavedConfigs(updated);
      localStorage.setItem('pipeline-forge-configs', JSON.stringify(updated));
      if (currentConfigName === name) {
        setCurrentConfigName('');
      }
    }
  }, [savedConfigs, currentConfigName]);

  const handleResetConfig = useCallback(() => {
    if (confirm('Reset to default configuration?')) {
      setConfig({
        projectName: "my-app",
        projectType: "nodejs",
        ciProvider: "github-actions",
        nodeVersion: "20",
        packageManager: "npm",
        isMonorepo: false,
        monorepoTool: "none",
        workingDirectory: ".",
        enableDocker: false,
        dockerImageName: "",
        enableTests: true,
        enableLinting: true,
        enableBuild: true,
        deployTarget: "none",
        branches: ["main"],
        enableCaching: true,
        enableSecurityScan: false,
        enableE2ETesting: false,
        enableCodeFormatting: false,
        enableTypeChecking: false,
        enableDependencyAudit: false,
        enableContainerScan: false,
        enableSonarQube: false,
        ciSettings: {
          concurrency: 1,
          timeout: 60,
          retryOnFailure: false,
          parallelJobs: false,
        },
        environmentVariables: [],
        customScripts: {},
        notifications: {
          enabled: false,
          slack: { enabled: false },
          email: { enabled: false },
        },
        matrixBuild: {
          enabled: false,
          versions: [],
        },
        artifacts: {
          enabled: false,
          paths: [],
          retention: 30,
        },
        schedule: {
          enabled: false,
          cron: "",
          timezone: "UTC",
        },
        codeQuality: {
          enabled: false,
          coverageThreshold: 80,
          qualityGate: false,
        },
        performance: {
          enabled: false,
          loadTesting: false,
          benchmarks: false,
        },
        services: {
          enabled: false,
          database: {
            enabled: false,
            type: "postgresql",
            migrations: false,
          },
          redis: false,
          elasticsearch: false,
        },
      });
      setCurrentConfigName('');
      setOutput('');
    }
  }, []);

  const handleApplyPreset = useCallback((presetKey: string) => {
    const preset = presets[presetKey];
    if (preset && confirm(`Apply preset "${presetLabels[presetKey].label}"? This will replace your current configuration.`)) {
      setConfig(prev => ({ ...prev, ...preset }));
      setCurrentConfigName('');
      setOutput('');
    }
  }, []);

  const handleExportConfig = useCallback(() => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.projectName}-pipeline-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const handleImportConfig = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string);
            if (confirm('Import this configuration? This will replace your current configuration.')) {
              setConfig(imported);
              setCurrentConfigName('');
              setOutput('');
            }
          } catch (err) {
            alert('Failed to parse JSON file. Please ensure it is a valid configuration.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  // Update package manager default when project type changes
  useEffect(() => {
    const defaults: Record<string, string> = {
      nodejs: "npm",
      python: "pip",
      java: "maven",
      go: "",
      rust: "",
      dotnet: "",
    };
    const defaultPm = defaults[config.projectType];
    if (defaultPm && config.packageManager !== defaultPm) {
      updateConfig("packageManager", defaultPm as PipelineConfig["packageManager"]);
    }
  }, [config.projectType]);

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
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    
    // Add to history (debounced to avoid too many entries)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newConfig);
    // Limit history to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setConfig(history[newIndex]);
    }
  }, [history, historyIndex]);

  const toggleStep = useCallback((stepIndex: number) => {
    setExpandedSteps(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(stepIndex)) {
        newExpanded.delete(stepIndex);
      } else {
        newExpanded.add(stepIndex);
      }
      return newExpanded;
    });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStep(stepIndex);
    setExpandedSteps(prev => new Set([stepIndex]));
  }, []);

  const completeStep = useCallback((stepIndex: number) => {
    if (stepIndex < steps.length - 1) {
      goToStep(stepIndex + 1);
    }
  }, [goToStep]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      {/* Configuration Panel */}
      <div className="space-y-3 sm:space-y-6">
        {/* Cost Estimation */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <IconCurrencyDollar className="h-4 w-4 sm:h-5 sm:w-5" />
              Cost Estimation
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Estimated monthly CI/CD costs</CardDescription>
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
                  <div className="text-lg font-bold text-green-600">${costEstimate.estimatedCost}</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Based on ~50 runs/month • Range: {costEstimate.costRange}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices Suggestions */}
        {suggestions.length > 0 && (
          <Card className={suggestions.some(s => s.type === 'warning') ? 'border-orange-200 dark:border-orange-900' : ''}>
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <IconInfoCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Best Practices
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Recommendations for your pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-2 rounded-lg ${
                    suggestion.type === 'warning'
                      ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200'
                      : suggestion.type === 'success'
                      ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
                      : 'bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200'
                  }`}
                >
                  {suggestion.type === 'warning' && (
                    <IconAlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  {suggestion.type === 'success' && (
                    <IconCheck className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  {suggestion.type === 'info' && (
                    <IconInfoCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs sm:text-sm">{suggestion.message}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Presets */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <IconTemplate className="h-4 w-4 sm:h-5 sm:w-5" />
              Quick Presets
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Start with a pre-configured template</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2">
              {Object.entries(presetLabels).map(([key, { label, description, icon: Icon }]) => (
                <button
                  key={key}
                  onClick={() => handleApplyPreset(key)}
                  className="flex items-start gap-3 p-3 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                >
                  <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved Configurations */}
        <Card>
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">Saved Configurations</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Save and load your pipeline configurations</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveConfig}
                  className="gap-1.5 text-xs"
                >
                  <IconDeviceFloppy className="h-3.5 w-3.5" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetConfig}
                  className="gap-1.5 text-xs"
                >
                  <IconRotate className="h-3.5 w-3.5" />
                  Reset
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className="gap-1.5 text-xs hidden sm:flex"
                    title="Undo (Ctrl+Z)"
                  >
                    <IconArrowBackUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className="gap-1.5 text-xs hidden sm:flex"
                    title="Redo (Ctrl+Y)"
                  >
                    <IconArrowForwardUp className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportConfig}
                  className="gap-1.5 text-xs hidden sm:flex"
                >
                  <IconDownload className="h-3.5 w-3.5" />
                  Export JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportConfig}
                  className="gap-1.5 text-xs hidden sm:flex"
                >
                  <IconUpload className="h-3.5 w-3.5" />
                  Import JSON
                </Button>
              </div>
            </div>
          </CardHeader>
          {Object.keys(savedConfigs).length > 0 && (
            <CardContent className="space-y-2 sm:space-y-3 p-3 sm:p-6">
              {Object.entries(savedConfigs).map(([name, cfg]) => (
                <div key={name} className="flex items-center justify-between gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
                  <button
                    onClick={() => handleLoadConfig(name)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <IconCode className="h-3.5 w-3.5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {cfg.projectType} · {cfg.ciProvider}
                      </div>
                    </div>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteConfig(name)}
                    className="h-8 w-8 p-0 shrink-0"
                  >
                    <IconTrash className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          )}
        </Card>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Progress</span>
              <span className="text-xs sm:text-sm font-semibold">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="flex gap-1">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;
                const isExpanded = expandedSteps.has(index);
                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-primary/10 border-2 border-primary'
                        : isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-500/50 dark:border-emerald-500/70'
                        : 'bg-muted/30 border-2 border-border hover:border-border/80'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? (
                        <IconCheck className="h-3 w-3 sm:h-4 sm:w-4" />
                      ) : (
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </div>
                    <span className={`text-[10px] sm:text-xs font-medium hidden sm:block ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className={expandedSteps.has(0) ? (currentStep > 0 ? 'border-emerald-500/50 dark:border-emerald-500/70' : 'border-primary') : ''}>
          <CardHeader className="pb-2 sm:pb-4">
            <button
              onClick={() => toggleStep(0)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  currentStep === 0
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 0
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 0 ? (
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm font-semibold">1</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    Project Details
                    {currentStep > 0 && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Name your project and select the stack</CardDescription>
                </div>
              </div>
              {expandedSteps.has(0) ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>
          {expandedSteps.has(0) && (
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

            {(config.projectType === "nodejs" || config.projectType === "python" || config.projectType === "java") && (
              <>
                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="package-manager" className="text-sm">Package Manager</Label>
                    <Select
                      value={config.packageManager || (config.projectType === "nodejs" ? "npm" : config.projectType === "python" ? "pip" : "maven")}
                      onValueChange={(v) => updateConfig("packageManager", v as PipelineConfig["packageManager"])}
                    >
                      <SelectTrigger id="package-manager" className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent position="popper" sideOffset={5}>
                        {config.projectType === "nodejs" && (
                          <>
                            <SelectItem value="npm">npm</SelectItem>
                            <SelectItem value="yarn">Yarn</SelectItem>
                            <SelectItem value="pnpm">pnpm</SelectItem>
                            <SelectItem value="bun">Bun</SelectItem>
                          </>
                        )}
                        {config.projectType === "python" && (
                          <>
                            <SelectItem value="pip">pip</SelectItem>
                            <SelectItem value="poetry">Poetry</SelectItem>
                          </>
                        )}
                        {config.projectType === "java" && (
                          <>
                            <SelectItem value="maven">Maven</SelectItem>
                            <SelectItem value="gradle">Gradle</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="working-dir" className="text-sm">Working Directory</Label>
                    <input
                      id="working-dir"
                      type="text"
                      value={config.workingDirectory || "."}
                      onChange={(e) => updateConfig("workingDirectory", e.target.value)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="."
                    />
                  </div>
                </div>
              </>
            )}

            {(config.projectType === "go" || config.projectType === "rust" || config.projectType === "dotnet") && (
              <>
                <Separator />

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="working-dir" className="text-sm">Working Directory</Label>
                  <input
                    id="working-dir"
                    type="text"
                    value={config.workingDirectory || "."}
                    onChange={(e) => updateConfig("workingDirectory", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="."
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="monorepo"
                  checked={config.isMonorepo}
                  onCheckedChange={(checked) => updateConfig("isMonorepo", checked === true)}
                />
                <Label htmlFor="monorepo" className="text-sm font-medium cursor-pointer">
                  Monorepo Project
                </Label>
              </div>

              {config.isMonorepo && (
                <div className="ml-6 space-y-1.5">
                  <Label htmlFor="monorepo-tool" className="text-xs text-muted-foreground">Monorepo Tool</Label>
                  <Select
                    value={config.monorepoTool || "none"}
                    onValueChange={(v) => updateConfig("monorepoTool", v as PipelineConfig["monorepoTool"])}
                  >
                    <SelectTrigger id="monorepo-tool" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      <SelectItem value="nx">Nx</SelectItem>
                      <SelectItem value="turborepo">Turborepo</SelectItem>
                      <SelectItem value="lerna">Lerna</SelectItem>
                      <SelectItem value="rush">Rush</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(0)}
                size="sm"
                className="gap-2"
              >
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* CI Provider */}
        <Card className={expandedSteps.has(1) ? (currentStep > 1 ? 'border-emerald-500/50 dark:border-emerald-500/70' : 'border-primary') : ''}>
          <CardHeader className="pb-2 sm:pb-4">
            <button
              onClick={() => toggleStep(1)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  currentStep === 1
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 1
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 1 ? (
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm font-semibold">2</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    CI/CD Provider
                    {currentStep > 1 && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Choose your pipeline platform and configure settings</CardDescription>
                </div>
              </div>
              {expandedSteps.has(1) ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>
          {expandedSteps.has(1) && (
            <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Provider</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
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
            </div>

            <Separator />

            <div className="space-y-2 sm:space-y-3">
              <Label className="text-sm font-semibold">Pipeline Settings</Label>
              
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="concurrency" className="text-xs text-muted-foreground">
                    Concurrency Limit
                  </Label>
                  <Input
                    id="concurrency"
                    type="number"
                    min="1"
                    max="10"
                    value={config.ciSettings?.concurrency || 1}
                    onChange={(e) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        concurrency: parseInt(e.target.value) || 1,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="timeout" className="text-xs text-muted-foreground">
                    Timeout (minutes)
                  </Label>
                  <Input
                    id="timeout"
                    type="number"
                    min="5"
                    max="360"
                    value={config.ciSettings?.timeout || 60}
                    onChange={(e) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        timeout: parseInt(e.target.value) || 60,
                      })
                    }
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retry-on-failure"
                    checked={config.ciSettings?.retryOnFailure}
                    onCheckedChange={(checked) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        retryOnFailure: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="retry-on-failure" className="text-xs cursor-pointer">
                    Retry on failure (auto-retry failed jobs)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parallel-jobs"
                    checked={config.ciSettings?.parallelJobs}
                    onCheckedChange={(checked) =>
                      updateConfig("ciSettings", {
                        ...config.ciSettings!,
                        parallelJobs: checked === true,
                      })
                    }
                  />
                  <Label htmlFor="parallel-jobs" className="text-xs cursor-pointer">
                    Enable parallel job execution
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(1)}
                size="sm"
                className="gap-2"
              >
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Pipeline Steps */}
        <Card className={expandedSteps.has(2) ? (currentStep > 2 ? 'border-emerald-500/50 dark:border-emerald-500/70' : 'border-primary') : ''}>
          <CardHeader className="pb-2 sm:pb-4">
            <button
              onClick={() => toggleStep(2)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  currentStep === 2
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 2
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 2 ? (
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm font-semibold">3</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    Pipeline Steps
                    {currentStep > 2 && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Configure what your pipeline does</CardDescription>
                </div>
              </div>
              {expandedSteps.has(2) ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>
          {expandedSteps.has(2) && (
            <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
              {[
                { key: "enableLinting" as const, label: "Linting" },
                { key: "enableTests" as const, label: "Unit Tests" },
                { key: "enableE2ETesting" as const, label: "E2E Tests" },
                { key: "enableBuild" as const, label: "Build" },
                { key: "enableCaching" as const, label: "Caching" },
                { key: "enableCodeFormatting" as const, label: "Code Formatting" },
                { key: "enableTypeChecking" as const, label: "Type Checking" },
                { key: "enableSecurityScan" as const, label: "Security Scan" },
                { key: "enableDependencyAudit" as const, label: "Dependency Audit" },
                { key: "enableContainerScan" as const, label: "Container Scan" },
                { key: "enableSonarQube" as const, label: "SonarQube Analysis" },
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
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(2)}
                size="sm"
                className="gap-2"
              >
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Deployment */}
        <Card className={expandedSteps.has(3) ? (currentStep > 3 ? 'border-emerald-500/50 dark:border-emerald-500/70' : 'border-primary') : ''}>
          <CardHeader className="pb-2 sm:pb-4">
            <button
              onClick={() => toggleStep(3)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  currentStep === 3
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 3
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 3 ? (
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm font-semibold">4</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    Deployment
                    {currentStep > 3 && <Badge variant="secondary" className="text-[10px]">Completed</Badge>}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Where should your app be deployed?</CardDescription>
                </div>
              </div>
              {expandedSteps.has(3) ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>
          {expandedSteps.has(3) && (
            <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Deployment Target</Label>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
                {deployTargets.map((target) => {
                  const Icon = "icon" in target ? target.icon : null;
                  const isSelected = config.deployTarget === target.value;
                  return (
                    <button
                      key={target.value}
                      onClick={() =>
                        updateConfig(
                          "deployTarget",
                          target.value as PipelineConfig["deployTarget"]
                        )
                      }
                      className={`flex items-center gap-2 rounded-lg border-2 p-2.5 sm:p-3 text-xs sm:text-sm font-medium transition-all hover:bg-accent/50 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="truncate">{target.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Target Branches</Label>
              <Select
                value={config.branches[0]}
                onValueChange={(v) => updateConfig("branches", [v])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <SelectItem value="main">main</SelectItem>
                  <SelectItem value="master">master</SelectItem>
                  <SelectItem value="develop">develop</SelectItem>
                  <SelectItem value="staging">staging</SelectItem>
                  <SelectItem value="production">production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.deployTarget !== "none" && (
              <>
                <Separator />
                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <IconCloud className="h-4 w-4 text-primary" />
                    <Label className="text-xs font-semibold">Deployment Settings</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {config.deployTarget === "aws" && "Deploy to AWS ECS with automated container orchestration"}
                    {config.deployTarget === "kubernetes" && "Deploy to Kubernetes cluster with kubectl apply"}
                    {config.deployTarget === "vercel" && "Deploy to Vercel with automatic preview deployments"}
                    {config.deployTarget === "netlify" && "Deploy to Netlify with continuous deployment"}
                    {config.deployTarget === "heroku" && "Deploy to Heroku with Git-based deployment"}
                    {config.deployTarget === "azure" && "Deploy to Azure App Service with CI/CD integration"}
                    {config.deployTarget === "gcp" && "Deploy to Google Cloud Platform with Cloud Run"}
                  </p>
                </div>
              </>
            )}
            <div className="flex justify-end pt-2">
              <Button
                onClick={() => completeStep(3)}
                size="sm"
                className="gap-2"
              >
                Next
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          )}
        </Card>

        {/* Advanced Features */}
        <Card className={expandedSteps.has(4) ? (currentStep > 4 ? 'border-emerald-500/50 dark:border-emerald-500/70' : 'border-primary') : ''}>
          <CardHeader className="pb-2 sm:pb-4">
            <button
              onClick={() => toggleStep(4)}
              className="flex items-center justify-between w-full text-left group"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all ${
                  currentStep === 4
                    ? 'bg-primary text-primary-foreground'
                    : currentStep > 4
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > 4 ? (
                    <IconCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <span className="text-sm font-semibold">5</span>
                  )}
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    Advanced Features
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">Optional</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">
                    Environment variables, custom scripts, and notifications
                  </CardDescription>
                </div>
              </div>
              {expandedSteps.has(4) ? (
                <IconChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <IconChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </CardHeader>

          {expandedSteps.has(4) && (
            <CardContent className="space-y-3 sm:space-y-5">
              {/* Environment Variables */}
              <div className="space-y-1.5 sm:space-y-3">
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
              <div className="space-y-1.5 sm:space-y-3">
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

              <Separator />

              {/* Matrix Build */}
              <div className="space-y-1.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="matrixBuild"
                    checked={config.matrixBuild?.enabled}
                    onCheckedChange={(checked) =>
                      updateConfig("matrixBuild", {
                        ...config.matrixBuild!,
                        enabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="matrixBuild" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <IconGitBranch className="h-4 w-4" />
                    Matrix Build (Multi-Version Testing)
                  </Label>
                </div>
                {config.matrixBuild?.enabled && (
                  <div className="ml-6 space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Test versions (comma-separated, e.g., 18, 20, 22)
                    </Label>
                    <Input
                      placeholder="18, 20, 22"
                      value={config.matrixBuild?.versions?.join(", ") || ""}
                      onChange={(e) => {
                        const versions = e.target.value.split(",").map((v) => v.trim()).filter(Boolean);
                        updateConfig("matrixBuild", {
                          ...config.matrixBuild!,
                          versions,
                        });
                      }}
                      className="text-xs h-8"
                    />
                  </div>
                )}
              </div>

              <Separator />

              {/* Artifacts */}
              <div className="space-y-1.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="artifacts"
                    checked={config.artifacts?.enabled}
                    onCheckedChange={(checked) =>
                      updateConfig("artifacts", {
                        ...config.artifacts!,
                        enabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="artifacts" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <IconPackage className="h-4 w-4" />
                    Artifact Management
                  </Label>
                </div>
                {config.artifacts?.enabled && (
                  <div className="ml-6 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Artifact paths (comma-separated)
                      </Label>
                      <Input
                        placeholder="dist/, build/, *.zip"
                        value={config.artifacts?.paths?.join(", ") || ""}
                        onChange={(e) => {
                          const paths = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
                          updateConfig("artifacts", {
                            ...config.artifacts!,
                            paths,
                          });
                        }}
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Retention days
                      </Label>
                      <Input
                        type="number"
                        placeholder="30"
                        value={config.artifacts?.retention || 30}
                        onChange={(e) =>
                          updateConfig("artifacts", {
                            ...config.artifacts!,
                            retention: parseInt(e.target.value) || 30,
                          })
                        }
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Schedule */}
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

              <Separator />

              {/* Code Quality & Coverage */}
              <div className="space-y-1.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="codeQuality"
                    checked={config.codeQuality?.enabled}
                    onCheckedChange={(checked) =>
                      updateConfig("codeQuality", {
                        ...config.codeQuality!,
                        enabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="codeQuality" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <IconChartBar className="h-4 w-4" />
                    Code Quality & Coverage
                  </Label>
                </div>
                {config.codeQuality?.enabled && (
                  <div className="ml-6 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">
                        Coverage threshold (%)
                      </Label>
                      <Input
                        type="number"
                        placeholder="80"
                        min="0"
                        max="100"
                        value={config.codeQuality?.coverageThreshold || 80}
                        onChange={(e) =>
                          updateConfig("codeQuality", {
                            ...config.codeQuality!,
                            coverageThreshold: parseInt(e.target.value) || 80,
                          })
                        }
                        className="text-xs h-8"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="qualityGate"
                        checked={config.codeQuality?.qualityGate}
                        onCheckedChange={(checked) =>
                          updateConfig("codeQuality", {
                            ...config.codeQuality!,
                            qualityGate: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="qualityGate" className="text-xs cursor-pointer">
                        Enable quality gate (fail on low coverage)
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Performance Testing */}
              <div className="space-y-1.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="performance"
                    checked={config.performance?.enabled}
                    onCheckedChange={(checked) =>
                      updateConfig("performance", {
                        ...config.performance!,
                        enabled: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="performance" className="text-sm font-semibold flex items-center gap-2 cursor-pointer">
                    <IconRocket className="h-4 w-4" />
                    Performance Testing
                  </Label>
                </div>
                {config.performance?.enabled && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="loadTesting"
                        checked={config.performance?.loadTesting}
                        onCheckedChange={(checked) =>
                          updateConfig("performance", {
                            ...config.performance!,
                            loadTesting: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="loadTesting" className="text-xs cursor-pointer">
                        Load testing (stress tests)
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="benchmarks"
                        checked={config.performance?.benchmarks}
                        onCheckedChange={(checked) =>
                          updateConfig("performance", {
                            ...config.performance!,
                            benchmarks: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="benchmarks" className="text-xs cursor-pointer">
                        Performance benchmarks
                      </Label>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Database & Services */}
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
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => {
                    setExpandedSteps(prev => new Set([...prev, 4]));
                    setCurrentStep(4);
                  }}
                  size="sm"
                  className="gap-2"
                >
                  Done
                  <IconCheck className="h-4 w-4" />
                </Button>
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
                <pre
                  className="code-scrollbar overflow-auto rounded-lg bg-muted/50 border p-3 sm:p-4 text-xs sm:text-sm font-mono leading-relaxed max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]"
                  dangerouslySetInnerHTML={{ __html: `<code>${highlightYAML(output)}</code>` }}
                />
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
