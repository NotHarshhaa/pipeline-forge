import { PipelineConfig } from "../types";

export function generateCircleCI(c: PipelineConfig): string {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);

  lines.push("version: 2.1");
  lines.push("");

  lines.push("orbs:");
  if (c.projectType === "nodejs") {
    lines.push(`${indent(1)}node: circleci/node@5.2`);
  } else if (c.projectType === "python") {
    lines.push(`${indent(1)}python: circleci/python@2.1`);
  } else if (c.projectType === "go") {
    lines.push(`${indent(1)}go: circleci/go@1.11`);
  }
  if (c.enableDocker) {
    lines.push(`${indent(1)}docker: circleci/docker@2.6`);
  }
  if (c.deployTarget === "aws") {
    lines.push(`${indent(1)}aws-cli: circleci/aws-cli@4.1`);
  } else if (c.deployTarget === "kubernetes") {
    lines.push(`${indent(1)}kubernetes: circleci/kubernetes@1.3`);
  }
  lines.push("");

  lines.push("jobs:");
  
  lines.push(`${indent(1)}build-and-test:`);
  lines.push(`${indent(2)}docker:`);
  lines.push(`${indent(3)}- image: ${getCircleCIImage(c)}`);
  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- checkout`);
  lines.push("");

  if (c.enableCaching) {
    lines.push(...getCircleCICacheRestore(c, 3));
    lines.push("");
  }

  lines.push(...getCircleCIInstallSteps(c, 3));
  lines.push("");

  if (c.enableCaching) {
    lines.push(...getCircleCICacheSave(c, 3));
    lines.push("");
  }

  if (c.enableLinting) {
    lines.push(...getCircleCILintSteps(c, 3));
    lines.push("");
  }

  if (c.enableSecurityScan) {
    lines.push(...getCircleCISecuritySteps(c, 3));
    lines.push("");
  }

  if (c.enableTests) {
    lines.push(...getCircleCITestSteps(c, 3));
    lines.push("");
  }

  if (c.enableBuild) {
    lines.push(...getCircleCIBuildSteps(c, 3));
    lines.push("");
  }

  if (c.enableDocker) {
    lines.push("");
    lines.push(`${indent(1)}docker-build-push:`);
    lines.push(`${indent(2)}docker:`);
    lines.push(`${indent(3)}- image: cimg/base:stable`);
    lines.push(`${indent(2)}steps:`);
    lines.push(`${indent(3)}- checkout`);
    lines.push(`${indent(3)}- setup_remote_docker:`);
    lines.push(`${indent(4)}docker_layer_caching: true`);
    lines.push(`${indent(3)}- docker/check`);
    lines.push(`${indent(3)}- docker/build:`);
    lines.push(`${indent(4)}image: ${c.dockerImageName || c.projectName}`);
    lines.push(`${indent(4)}tag: \${CIRCLE_SHA1},latest`);
    lines.push(`${indent(3)}- docker/push:`);
    lines.push(`${indent(4)}image: ${c.dockerImageName || c.projectName}`);
    lines.push(`${indent(4)}tag: \${CIRCLE_SHA1},latest`);
  }

  if (c.deployTarget !== "none") {
    lines.push("");
    lines.push(`${indent(1)}deploy:`);
    lines.push(`${indent(2)}docker:`);
    lines.push(`${indent(3)}- image: cimg/base:stable`);
    lines.push(`${indent(2)}steps:`);
    lines.push(`${indent(3)}- checkout`);
    
    if (c.deployTarget === "aws") {
      lines.push(`${indent(3)}- aws-cli/setup`);
      lines.push(`${indent(3)}- run:`);
      lines.push(`${indent(4)}name: Deploy to AWS ECS`);
      lines.push(`${indent(4)}command: |`);
      lines.push(`${indent(5)}aws ecs update-service \\`);
      lines.push(`${indent(6)}--cluster \${AWS_CLUSTER} \\`);
      lines.push(`${indent(6)}--service \${AWS_SERVICE} \\`);
      lines.push(`${indent(6)}--force-new-deployment`);
    } else if (c.deployTarget === "kubernetes") {
      lines.push(`${indent(3)}- kubernetes/install-kubectl`);
      lines.push(`${indent(3)}- run:`);
      lines.push(`${indent(4)}name: Deploy to Kubernetes`);
      lines.push(`${indent(4)}command: |`);
      lines.push(`${indent(5)}kubectl apply -f k8s/`);
      lines.push(`${indent(5)}kubectl rollout status deployment/\${K8S_DEPLOYMENT}`);
    }
  }

  lines.push("");
  lines.push("workflows:");
  lines.push(`${indent(1)}build-test-deploy:`);
  lines.push(`${indent(2)}jobs:`);
  lines.push(`${indent(3)}- build-and-test`);
  
  if (c.enableDocker) {
    lines.push(`${indent(3)}- docker-build-push:`);
    lines.push(`${indent(4)}requires:`);
    lines.push(`${indent(5)}- build-and-test`);
    lines.push(`${indent(4)}filters:`);
    lines.push(`${indent(5)}branches:`);
    lines.push(`${indent(6)}only: ${c.branches[0] || "main"}`);
  }

  if (c.deployTarget !== "none") {
    const requiresJob = c.enableDocker ? "docker-build-push" : "build-and-test";
    lines.push(`${indent(3)}- deploy:`);
    lines.push(`${indent(4)}requires:`);
    lines.push(`${indent(5)}- ${requiresJob}`);
    lines.push(`${indent(4)}filters:`);
    lines.push(`${indent(5)}branches:`);
    lines.push(`${indent(6)}only: ${c.branches[0] || "main"}`);
  }

  return lines.join("\n");
}

function getCircleCIImage(c: PipelineConfig): string {
  switch (c.projectType) {
    case "nodejs": return `cimg/node:${c.nodeVersion || "20.0"}`;
    case "python": return `cimg/python:${c.pythonVersion || "3.12"}`;
    case "java": return `cimg/openjdk:${c.javaVersion || "17.0"}`;
    case "go": return `cimg/go:${c.goVersion || "1.22"}`;
    case "rust": return "cimg/rust:1.75";
    case "dotnet": return "mcr.microsoft.com/dotnet/sdk:8.0";
    default: return "cimg/base:stable";
  }
}

function getCircleCICacheRestore(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- restore_cache:`);
  lines.push(`${indent(depth + 1)}keys:`);
  
  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}- node-deps-{{ checksum "package-lock.json" }}`);
      lines.push(`${indent(depth + 2)}- node-deps-`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}- pip-deps-{{ checksum "requirements.txt" }}`);
      lines.push(`${indent(depth + 2)}- pip-deps-`);
      break;
    case "java":
      lines.push(`${indent(depth + 2)}- maven-deps-{{ checksum "pom.xml" }}`);
      lines.push(`${indent(depth + 2)}- maven-deps-`);
      break;
    case "go":
      lines.push(`${indent(depth + 2)}- go-deps-{{ checksum "go.sum" }}`);
      lines.push(`${indent(depth + 2)}- go-deps-`);
      break;
  }

  return lines;
}

function getCircleCICacheSave(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- save_cache:`);
  
  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 1)}key: node-deps-{{ checksum "package-lock.json" }}`);
      lines.push(`${indent(depth + 1)}paths:`);
      lines.push(`${indent(depth + 2)}- node_modules`);
      break;
    case "python":
      lines.push(`${indent(depth + 1)}key: pip-deps-{{ checksum "requirements.txt" }}`);
      lines.push(`${indent(depth + 1)}paths:`);
      lines.push(`${indent(depth + 2)}- ~/.cache/pip`);
      break;
    case "java":
      lines.push(`${indent(depth + 1)}key: maven-deps-{{ checksum "pom.xml" }}`);
      lines.push(`${indent(depth + 1)}paths:`);
      lines.push(`${indent(depth + 2)}- ~/.m2/repository`);
      break;
    case "go":
      lines.push(`${indent(depth + 1)}key: go-deps-{{ checksum "go.sum" }}`);
      lines.push(`${indent(depth + 1)}paths:`);
      lines.push(`${indent(depth + 2)}- ~/go/pkg/mod`);
      break;
  }

  return lines;
}

function getCircleCIInstallSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- run:`);
  lines.push(`${indent(depth + 1)}name: Install dependencies`);
  lines.push(`${indent(depth + 1)}command: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}npm ci`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}python -m pip install --upgrade pip`);
      lines.push(`${indent(depth + 2)}pip install -r requirements.txt`);
      break;
    case "java":
      lines.push(`${indent(depth + 2)}mvn dependency:resolve`);
      break;
    case "go":
      lines.push(`${indent(depth + 2)}go mod download`);
      break;
    case "rust":
      lines.push(`${indent(depth + 2)}cargo fetch`);
      break;
    case "dotnet":
      lines.push(`${indent(depth + 2)}dotnet restore`);
      break;
  }

  return lines;
}

function getCircleCILintSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- run:`);
  lines.push(`${indent(depth + 1)}name: Run linter`);
  lines.push(`${indent(depth + 1)}command: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}npm run lint`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}pip install flake8`);
      lines.push(`${indent(depth + 2)}flake8 .`);
      break;
    case "java":
      lines.push(`${indent(depth + 2)}mvn checkstyle:check`);
      break;
    case "go":
      lines.push(`${indent(depth + 2)}golangci-lint run`);
      break;
    case "rust":
      lines.push(`${indent(depth + 2)}cargo clippy -- -D warnings`);
      break;
    case "dotnet":
      lines.push(`${indent(depth + 2)}dotnet format --verify-no-changes`);
      break;
  }

  return lines;
}

function getCircleCISecuritySteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- run:`);
  lines.push(`${indent(depth + 1)}name: Security scan`);
  lines.push(`${indent(depth + 1)}command: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}npm audit --audit-level=high`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}pip install safety`);
      lines.push(`${indent(depth + 2)}safety check`);
      break;
    default:
      lines.push(`${indent(depth + 2)}echo "Security scan placeholder"`);
      break;
  }

  return lines;
}

function getCircleCITestSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- run:`);
  lines.push(`${indent(depth + 1)}name: Run tests`);
  lines.push(`${indent(depth + 1)}command: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}npm test`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}pip install pytest`);
      lines.push(`${indent(depth + 2)}pytest`);
      break;
    case "java":
      lines.push(`${indent(depth + 2)}mvn test`);
      break;
    case "go":
      lines.push(`${indent(depth + 2)}go test ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth + 2)}cargo test`);
      break;
    case "dotnet":
      lines.push(`${indent(depth + 2)}dotnet test`);
      break;
  }

  return lines;
}

function getCircleCIBuildSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- run:`);
  lines.push(`${indent(depth + 1)}name: Build`);
  lines.push(`${indent(depth + 1)}command: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth + 2)}npm run build`);
      break;
    case "python":
      lines.push(`${indent(depth + 2)}python setup.py sdist bdist_wheel`);
      break;
    case "java":
      lines.push(`${indent(depth + 2)}mvn package -DskipTests`);
      break;
    case "go":
      lines.push(`${indent(depth + 2)}go build ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth + 2)}cargo build --release`);
      break;
    case "dotnet":
      lines.push(`${indent(depth + 2)}dotnet build --configuration Release`);
      break;
  }

  return lines;
}
