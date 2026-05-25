import type { PipelineConfig } from "@/lib/generate-pipeline";

export interface CostEstimate {
  monthlyMinutes: number;
  estimatedCost: number;
  costRange: string;
  provider: string;
  tier: string;
}

export function estimatePipelineCost(config: PipelineConfig): CostEstimate {
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
