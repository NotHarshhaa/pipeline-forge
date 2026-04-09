import { PipelineConfig } from "../types";
import { generateGitHubActions } from "./github-actions";
import { generateGitLabCI } from "./gitlab-ci";
import { generateJenkins } from "./jenkins";
import { generateCircleCI } from "./circleci";
import { generateAzurePipelines } from "./azure-pipelines";

type TemplateGenerator = (config: PipelineConfig) => string;

const templateRegistry: Record<PipelineConfig["ciProvider"], TemplateGenerator> = {
  "github-actions": generateGitHubActions,
  "gitlab-ci": generateGitLabCI,
  "jenkins": generateJenkins,
  "circleci": generateCircleCI,
  "azure-pipelines": generateAzurePipelines,
};

export function generatePipeline(config: PipelineConfig): string {
  const generator = templateRegistry[config.ciProvider];
  
  if (!generator) {
    throw new Error(`Unsupported CI provider: ${config.ciProvider}`);
  }
  
  return generator(config);
}

export { generateGitHubActions, generateGitLabCI, generateJenkins, generateCircleCI, generateAzurePipelines };
