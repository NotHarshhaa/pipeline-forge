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
  deployTarget: "none" | "aws" | "kubernetes" | "vercel" | "netlify" | "heroku" | "azure" | "gcp";
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
