import type { PipelineConfig } from "@/lib/generate-pipeline";

export interface Suggestion {
  type: "warning" | "info" | "success";
  message: string;
}

export function analyzeBestPractices(config: PipelineConfig): Suggestion[] {
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
  
  // Optimization suggestions
  if (!config.optimization?.enabled) {
    suggestions.push({
      type: 'info',
      message: 'Enable pipeline optimization to improve build performance'
    });
  }
  
  if (config.optimization?.enabled && !config.optimization.parallelizeTests && config.enableTests) {
    suggestions.push({
      type: 'info',
      message: 'Parallel test execution can significantly reduce CI time'
    });
  }
  
  if (config.optimization?.enabled && !config.optimization.cacheDependencies) {
    suggestions.push({
      type: 'warning',
      message: 'Dependency caching is recommended for faster builds'
    });
  }
  
  if (config.enableDocker && !config.optimization?.useBuildKit) {
    suggestions.push({
      type: 'info',
      message: 'Docker BuildKit can improve build performance and caching'
    });
  }
  
  // Multi-environment suggestions
  if (config.deployTarget !== 'none' && !config.environments?.enabled) {
    suggestions.push({
      type: 'info',
      message: 'Consider multi-environment deployment for dev/staging/prod workflows'
    });
  }
  
  // Deployment strategy suggestions
  if (config.deployTarget === 'kubernetes' && !config.deploymentStrategy) {
    suggestions.push({
      type: 'info',
      message: 'Choose a deployment strategy (rolling, blue-green, canary) for Kubernetes'
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
  
  if (config.optimization?.enabled && config.optimization.parallelizeTests && config.optimization.cacheDependencies) {
    suggestions.push({
      type: 'success',
      message: 'Excellent! Pipeline optimization is fully configured'
    });
  }
  
  return suggestions;
}
