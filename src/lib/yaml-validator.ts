/**
 * YAML validation for generated pipeline output.
 */

import type { PipelineConfig } from "./types";

export interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export type CiProvider = PipelineConfig["ciProvider"];

export function validateYAML(
  yaml: string,
  ciProvider: CiProvider = "github-actions"
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const lines = yaml.split("\n");

  let inMultilineString = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    if (inMultilineString) {
      if (line.trim() === "|" || line.trim() === ">") {
        inMultilineString = false;
      }
      continue;
    }

    if (/\|\s*$/.test(line) || />\s*$/.test(line)) {
      inMultilineString = true;
      continue;
    }

    if (line.includes("\t")) {
      errors.push({
        line: lineNumber,
        column: line.indexOf("\t") + 1,
        message: "Tabs are not allowed in YAML. Use spaces instead.",
        severity: "error",
      });
    }

    const keyMatch = line.match(/^(\s*)([\w-]+):/);
    if (keyMatch) {
      const key = keyMatch[2];
      if (!/^[a-zA-Z_][\w-]*$/.test(key)) {
        warnings.push({
          line: lineNumber,
          column: keyMatch[1].length + 1,
          message: `Key "${key}" may contain invalid characters`,
          severity: "warning",
        });
      }
    }

    if (
      line.trim() &&
      !line.includes(":") &&
      !line.trim().startsWith("- ") &&
      !line.trim().startsWith("|") &&
      !line.trim().startsWith(">")
    ) {
      warnings.push({
        line: lineNumber,
        column: 1,
        message: "Line may be missing a colon (:) for a key-value pair",
        severity: "warning",
      });
    }

    if (line !== line.trimEnd()) {
      warnings.push({
        line: lineNumber,
        column: line.trimEnd().length + 1,
        message: "Trailing spaces detected",
        severity: "warning",
      });
    }
  }

  switch (ciProvider) {
    case "github-actions":
      validateGitHubActions(yaml, errors, warnings);
      break;
    case "gitlab-ci":
      validateGitLabCI(yaml, errors, warnings);
      break;
    case "jenkins":
      validateJenkins(yaml, errors, warnings);
      break;
    case "circleci":
      validateCircleCI(yaml, errors, warnings);
      break;
    case "azure-pipelines":
      validateAzurePipelines(yaml, errors, warnings);
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateGitHubActions(
  yaml: string,
  errors: ValidationError[],
  warnings: ValidationError[]
): void {
  const lines = yaml.split("\n");

  if (!yaml.includes("name:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required field "name"',
      severity: "error",
    });
  }

  if (!yaml.includes("on:")) {
    errors.push({
      line: 1,
      column: 1,
      message: "Missing required trigger configuration (on:)",
      severity: "error",
    });
  }

  if (!yaml.includes("jobs:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required field "jobs"',
      severity: "error",
    });
  }

  if (/^\s+concurrency:/m.test(yaml.split("jobs:")[1] ?? "")) {
    errors.push({
      line: 1,
      column: 1,
      message:
        '"concurrency" must be defined at workflow root, not inside "jobs"',
      severity: "error",
    });
  }

  const deprecatedActions = [
    "actions/checkout@v1",
    "actions/checkout@v2",
    "actions/checkout@v3",
    "actions/setup-node@v1",
    "actions/setup-node@v2",
    "actions/setup-node@v3",
    "actions/cache@v1",
    "actions/cache@v2",
    "actions/cache@v3",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const action of deprecatedActions) {
      if (line.includes(action)) {
        warnings.push({
          line: i + 1,
          column: line.indexOf(action) + 1,
          message: `Using deprecated action version: ${action}. Prefer current major versions.`,
          severity: "warning",
        });
      }
    }
  }
}

function validateGitLabCI(
  yaml: string,
  errors: ValidationError[],
  _warnings: ValidationError[]
): void {
  if (!yaml.includes("stages:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Missing required field "stages"',
      severity: "error",
    });
  }
}

function validateJenkins(
  yaml: string,
  errors: ValidationError[],
  _warnings: ValidationError[]
): void {
  if (!yaml.includes("pipeline {")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Jenkins output should start with "pipeline {"',
      severity: "error",
    });
  }
}

function validateCircleCI(
  yaml: string,
  errors: ValidationError[],
  _warnings: ValidationError[]
): void {
  if (!yaml.includes("version:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'CircleCI config requires "version"',
      severity: "error",
    });
  }
  if (!yaml.includes("workflows:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'CircleCI config requires "workflows"',
      severity: "error",
    });
  }
}

function validateAzurePipelines(
  yaml: string,
  errors: ValidationError[],
  _warnings: ValidationError[]
): void {
  if (!yaml.includes("stages:") && !yaml.includes("steps:")) {
    errors.push({
      line: 1,
      column: 1,
      message: 'Azure Pipelines config requires "stages" or "steps"',
      severity: "error",
    });
  }
}

export function validatePipelineConfig(
  config: PipelineConfig
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!config.projectName?.trim()) {
    errors.push({
      line: 0,
      column: 0,
      message: "Project name is required",
      severity: "error",
    });
  }

  if (!config.projectType) {
    errors.push({
      line: 0,
      column: 0,
      message: "Project type is required",
      severity: "error",
    });
  }

  if (!config.ciProvider) {
    errors.push({
      line: 0,
      column: 0,
      message: "CI provider is required",
      severity: "error",
    });
  }

  if (config.projectType === "nodejs" && !config.nodeVersion) {
    errors.push({
      line: 0,
      column: 0,
      message: "Node version is required for Node.js projects",
      severity: "error",
    });
  }

  if (config.projectType === "python" && !config.pythonVersion) {
    errors.push({
      line: 0,
      column: 0,
      message: "Python version is required for Python projects",
      severity: "error",
    });
  }

  if (config.enableDocker && !config.dockerImageName?.trim()) {
    errors.push({
      line: 0,
      column: 0,
      message: "Docker image name is required when Docker is enabled",
      severity: "warning",
    });
  }

  if (config.deployTarget !== "none" && !config.enableBuild) {
    errors.push({
      line: 0,
      column: 0,
      message: "Build step should be enabled for deployment",
      severity: "warning",
    });
  }

  if (config.branches.length === 0) {
    errors.push({
      line: 0,
      column: 0,
      message: "At least one branch must be configured",
      severity: "warning",
    });
  }

  return errors;
}
