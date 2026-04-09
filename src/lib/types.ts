export interface PipelineConfig {
  projectName: string;
  projectType: "nodejs" | "python" | "java" | "go" | "rust" | "dotnet";
  ciProvider: "github-actions" | "gitlab-ci" | "jenkins" | "circleci" | "azure-pipelines";
  nodeVersion?: string;
  pythonVersion?: string;
  javaVersion?: string;
  goVersion?: string;
  enableDocker: boolean;
  dockerfilePath?: string;
  dockerImageName?: string;
  enableTests: boolean;
  enableLinting: boolean;
  enableBuild: boolean;
  deployTarget: "none" | "aws" | "kubernetes";
  branches: string[];
  enableCaching: boolean;
  enableSecurityScan: boolean;
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
