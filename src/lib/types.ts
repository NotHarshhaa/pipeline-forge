export interface PipelineConfig {
  projectName: string;
  projectType: "nodejs" | "python" | "java" | "go" | "rust" | "dotnet";
  ciProvider: "github-actions" | "gitlab-ci" | "jenkins" | "circleci" | "azure-pipelines";
  nodeVersion?: string;
  pythonVersion?: string;
  javaVersion?: string;
  goVersion?: string;
  packageManager?: "npm" | "yarn" | "pnpm" | "bun" | "pip" | "poetry" | "maven" | "gradle";
  isMonorepo?: boolean;
  monorepoTool?: "nx" | "turborepo" | "lerna" | "rush" | "none";
  workingDirectory?: string;
  enableDocker: boolean;
  dockerfilePath?: string;
  dockerImageName?: string;
  enableTests: boolean;
  enableLinting: boolean;
  enableBuild: boolean;
  deployTarget: "none" | "aws" | "kubernetes" | "vercel" | "netlify" | "heroku" | "azure" | "gcp" | "fly-io" | "railway" | "cloudflare-pages" | "digitalocean";
  branches: string[];
  enableCaching: boolean;
  enableSecurityScan: boolean;
  enableE2ETesting: boolean;
  enableCodeFormatting: boolean;
  enableTypeChecking: boolean;
  enableDependencyAudit: boolean;
  enableContainerScan: boolean;
  enableSonarQube: boolean;
  // CI Provider Settings
  ciSettings?: {
    concurrency?: number;
    timeout?: number;
    retryOnFailure?: boolean;
    parallelJobs?: boolean;
  };
  // New features
  environmentVariables?: Array<{ key: string; value: string }>;
  customScripts?: {
    preBuild?: string;
    postBuild?: string;
    preTest?: string;
  };
  notifications?: {
    enabled: boolean;
    slack?: {
      enabled: boolean;
      webhookUrl?: string;
    };
    email?: {
      enabled: boolean;
      recipients?: string;
    };
  };
  // Additional new features
  matrixBuild?: {
    enabled: boolean;
    versions?: string[];
  };
  artifacts?: {
    enabled: boolean;
    paths?: string[];
    retention?: number;
  };
  schedule?: {
    enabled: boolean;
    cron?: string;
    timezone?: string;
  };
  // More advanced features
  codeQuality?: {
    enabled: boolean;
    coverageThreshold?: number;
    qualityGate?: boolean;
  };
  performance?: {
    enabled: boolean;
    loadTesting?: boolean;
    benchmarks?: boolean;
  };
  services?: {
    enabled: boolean;
    database?: {
      enabled: boolean;
      type?: string;
      migrations?: boolean;
    };
    redis?: boolean;
    elasticsearch?: boolean;
  };
  // Conditional execution
  conditionalSteps?: {
    enabled: boolean;
    rules?: Array<{
      step: string;
      condition: 'branch' | 'path' | 'event' | 'custom';
      value: string;
    }>;
  };
  // Multi-environment support
  environments?: {
    enabled: boolean;
    stages?: Array<{
      name: string;
      branch: string;
      autoDeploy: boolean;
      requireApproval: boolean;
    }>;
  };
  // Deployment strategies
  deploymentStrategy?: 'rolling' | 'blue-green' | 'canary' | 'recreate';
  // Custom marketplace actions
  customActions?: Array<{
    name: string;
    uses: string;
    with?: Record<string, string>;
    runAfter?: string;
  }>;
  // Pipeline optimization
  optimization?: {
    enabled: boolean;
    parallelizeTests: boolean;
    splitTests: boolean;
    cacheDependencies: boolean;
    useBuildKit: boolean;
  };
}

export const defaults: Record<string, Partial<PipelineConfig>> = {
  nodejs: { nodeVersion: "20" },
  python: { pythonVersion: "3.12" },
  java: { javaVersion: "17" },
  go: { goVersion: "1.22" },
  rust: {},
  dotnet: {},
};

export function getDefaults(projectType: string): Partial<PipelineConfig> {
  return defaults[projectType] || {};
}
