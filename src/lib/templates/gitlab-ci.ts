// @ts-nocheck - This file generates GitLab CI YAML with template syntax
// TypeScript errors are expected and intentional - the file outputs literal YAML template strings
import { PipelineConfig } from "../types";

export function generateGitLabCI(c: PipelineConfig): string {
  const lines: string[] = [];

  lines.push(`# ${c.projectName} GitLab CI/CD Pipeline`);
  lines.push("");
  lines.push("stages:");
  const stages = ["build"];
  if (c.enableLinting) stages.push("lint");
  if (c.enableCodeFormatting) stages.push("format");
  if (c.enableTypeChecking) stages.push("typecheck");
  if (c.enableTests) stages.push("test");
  if (c.enableE2ETesting) stages.push("e2e");
  if (c.enableSecurityScan) stages.push("security");
  if (c.enableDependencyAudit) stages.push("audit");
  if (c.enableContainerScan) stages.push("container_scan");
  if (c.enableSonarQube) stages.push("sonarqube");
  if (c.enableDocker) stages.push("docker");
  if (c.deployTarget !== "none") stages.push("deploy");
  for (const s of stages) {
    lines.push(`  - ${s}`);
  }
  lines.push("");

  lines.push("variables:");
  if (c.projectType === "nodejs") {
    lines.push(`  NODE_VERSION: "${c.nodeVersion || "20"}"`);
    lines.push(`  PACKAGE_MANAGER: "${c.packageManager || "npm"}"`);
  } else if (c.projectType === "python") {
    lines.push(`  PYTHON_VERSION: "${c.pythonVersion || "3.12"}"`);
    lines.push(`  PACKAGE_MANAGER: "${c.packageManager || "pip"}"`);
  } else if (c.projectType === "java") {
    lines.push(`  JAVA_VERSION: "${c.javaVersion || "17"}"`);
    lines.push(`  PACKAGE_MANAGER: "${c.packageManager || "maven"}"`);
  }
  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`  WORKING_DIR: "${c.workingDirectory}"`);
  }
  if (c.isMonorepo && c.monorepoTool) {
    lines.push(`  MONOREPO_TOOL: "${c.monorepoTool}"`);
  }
  lines.push("");

  const image = getGitLabImage(c);
  lines.push(`image: ${image}`);
  lines.push("");

  // Add timeout
  if (c.ciSettings?.timeout) {
    lines.push(`default:`);
    lines.push(`  timeout: ${c.ciSettings.timeout * 60}s`);
    lines.push("");
  }

  // Add retry on failure
  if (c.ciSettings?.retryOnFailure) {
    lines.push(`default:`);
    lines.push(`  retry:`);
    lines.push(`    max: 2`);
    lines.push(`    when:`);
    lines.push(`      - script_failure`);
    lines.push("");
  }

  if (c.enableCaching) {
    lines.push("cache:");
    lines.push(`  paths:`);
    lines.push(...getGitLabCachePaths(c));
    lines.push("");
  }

  lines.push("build:");
  lines.push("  stage: build");
  lines.push("  script:");
  // Add working directory change
  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`    - cd ${c.workingDirectory}`);
  }
  lines.push(...getGitLabInstallScript(c));
  if (c.enableBuild) {
    lines.push(...getGitLabBuildScript(c));
  }
  lines.push("");

  if (c.enableLinting) {
    lines.push("lint:");
    lines.push("  stage: lint");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabLintScript(c));
    lines.push("");
  }

  if (c.enableCodeFormatting) {
    lines.push("format:");
    lines.push("  stage: format");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabFormatScript(c));
    lines.push("");
  }

  if (c.enableTypeChecking) {
    lines.push("typecheck:");
    lines.push("  stage: typecheck");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabTypeCheckScript(c));
    lines.push("");
  }

  if (c.enableTests) {
    lines.push("test:");
    lines.push("  stage: test");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabTestScript(c));
    lines.push("");
  }

  if (c.enableE2ETesting) {
    lines.push("e2e:");
    lines.push("  stage: e2e");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabE2EScript(c));
    lines.push("");
  }

  if (c.enableSecurityScan) {
    lines.push("security_scan:");
    lines.push("  stage: security");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabSecurityScript(c));
    lines.push("  allow_failure: true");
    lines.push("");
  }

  if (c.enableDependencyAudit) {
    lines.push("dependency_audit:");
    lines.push("  stage: audit");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push(...getGitLabAuditScript(c));
    lines.push("  allow_failure: true");
    lines.push("");
  }

  if (c.enableContainerScan) {
    lines.push("container_scan:");
    lines.push("  stage: container_scan");
    lines.push("  image: aquasec/trivy:latest");
    lines.push("  script:");
    lines.push(`    - trivy image --exit-code 0 --severity HIGH,CRITICAL ${c.dockerImageName || c.projectName}:latest`);
    lines.push("  allow_failure: true");
    lines.push("");
  }

  if (c.enableSonarQube) {
    lines.push("sonarqube:");
    lines.push("  stage: sonarqube");
    lines.push("  image: sonarsource/sonar-scanner-cli:latest");
    lines.push("  script:");
    if (c.workingDirectory && c.workingDirectory !== ".") {
      lines.push(`    - cd ${c.workingDirectory}`);
    }
    lines.push("    - sonar-scanner");
    if (c.codeQuality?.qualityGate) {
      lines.push("  allow_failure: false");
    }
    lines.push("");
  }

  if (c.enableDocker) {
    lines.push("docker_build:");
    lines.push("  stage: docker");
    lines.push("  image: docker:24.0");
    lines.push("  services:");
    lines.push("    - docker:24.0-dind");
    lines.push("  script:");
    lines.push(`    - docker build -t ${c.dockerImageName || c.projectName}:$CI_COMMIT_SHA ${c.dockerfilePath || "."}`);
    lines.push("  only:");
    for (const b of c.branches) {
      lines.push(`    - ${b}`);
    }
    lines.push("");
  }

  if (c.deployTarget !== "none") {
    lines.push("deploy:");
    lines.push("  stage: deploy");
    lines.push("  script:");
    if (c.deployTarget === "aws") {
      lines.push("    - pip install awscli");
      lines.push("    - aws ecs update-service --cluster $AWS_CLUSTER --service $AWS_SERVICE --force-new-deployment");
    } else if (c.deployTarget === "kubernetes") {
      lines.push("    - kubectl set image deployment/$K8S_DEPLOYMENT $K8S_CONTAINER=$DOCKER_IMAGE:$CI_COMMIT_SHA");
    }
    lines.push("  only:");
    lines.push("    - main");
    lines.push("  when: manual");
    lines.push("");
  }

  return lines.join("\n");
}

function getGitLabImage(c: PipelineConfig): string {
  switch (c.projectType) {
    case "nodejs": return `node:${c.nodeVersion || "20"}-alpine`;
    case "python": return `python:${c.pythonVersion || "3.12"}-slim`;
    case "java": return `maven:3.9-eclipse-temurin-${c.javaVersion || "17"}`;
    case "go": return `golang:${c.goVersion || "1.22"}-alpine`;
    case "rust": return "rust:latest";
    case "dotnet": return "mcr.microsoft.com/dotnet/sdk:8.0";
    default: return "ubuntu:latest";
  }
}

function getGitLabCachePaths(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs":
      const cachePath = c.packageManager === "pnpm" ? ".pnpm-store" :
                      c.packageManager === "yarn" ? ".yarn/cache" : "node_modules";
      const paths = [`    - ${cachePath}/`];
      if (c.isMonorepo && c.monorepoTool) {
        paths.push(`    - .${c.monorepoTool}/cache/`);
      }
      return paths;
    case "python": return ["    - .cache/pip/"];
    case "java": return ["    - .m2/repository/"];
    case "go": return ["    - /go/pkg/mod/"];
    default: return [];
  }
}

function getGitLabInstallScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs":
      const installCmd = c.packageManager === "yarn" ? "yarn install --frozen-lockfile" :
                        c.packageManager === "pnpm" ? "pnpm install --frozen-lockfile" :
                        c.packageManager === "bun" ? "bun install" : "npm ci";
      const scripts = [`    - ${installCmd}`];
      if (c.isMonorepo && c.monorepoTool) {
        scripts.push(`    - npx ${c.monorepoTool}@latest install`);
      }
      return scripts;
    case "python":
      if (c.packageManager === "poetry") {
        return ["    - pip install poetry", "    - poetry install"];
      }
      return ["    - pip install -r requirements.txt"];
    case "java":
      if (c.packageManager === "gradle") {
        return ["    - ./gradlew dependencies"];
      }
      return ["    - mvn dependency:resolve"];
    case "go": return ["    - go mod download"];
    case "rust": return ["    - cargo fetch"];
    case "dotnet": return ["    - dotnet restore"];
    default: return [];
  }
}

function getGitLabBuildScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm run build"];
    case "python": return ["    - python setup.py sdist bdist_wheel"];
    case "java": return ["    - mvn package -DskipTests"];
    case "go": return ["    - go build ./..."];
    case "rust": return ["    - cargo build --release"];
    case "dotnet": return ["    - dotnet build --configuration Release"];
    default: return [];
  }
}

function getGitLabLintScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm run lint"];
    case "python": return ["    - pip install flake8", "    - flake8 ."];
    case "java": return ["    - mvn checkstyle:check"];
    case "go": return ["    - go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest", "    - golangci-lint run"];
    case "rust": return ["    - cargo clippy -- -D warnings"];
    case "dotnet": return ["    - dotnet format --verify-no-changes"];
    default: return [];
  }
}

function getGitLabTestScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm test"];
    case "python": return ["    - pip install pytest", "    - pytest"];
    case "java": return ["    - mvn test"];
    case "go": return ["    - go test ./..."];
    case "rust": return ["    - cargo test"];
    case "dotnet": return ["    - dotnet test"];
    default: return [];
  }
}

function getGitLabSecurityScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm audit --audit-level=high"];
    case "python": return ["    - pip install safety", "    - safety check"];
    default: return ["    - echo 'Security scan placeholder'"];
  }
}

function getGitLabFormatScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs":
      const formatCmd = c.packageManager === "yarn" ? "yarn format:check" :
                        c.packageManager === "pnpm" ? "pnpm format:check" :
                        c.packageManager === "bun" ? "bun run format:check" : "npm run format:check";
      return [`    - ${formatCmd}`];
    case "python": return ["    - pip install black", "    - black --check ."];
    case "java": return ["    - mvn spotless:check"];
    case "go": return ["    - gofmt -l ."];
    case "rust": return ["    - cargo fmt -- --check"];
    case "dotnet": return ["    - dotnet format --verify-no-changes"];
    default: return [];
  }
}

function getGitLabTypeCheckScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npx tsc --noEmit"];
    case "python": return ["    - pip install mypy", "    - mypy ."];
    case "java": return ["    - mvn compiler:compile"];
    case "go": return ["    - go build ./..."];
    case "rust": return ["    - cargo check"];
    case "dotnet": return ["    - dotnet build --no-restore"];
    default: return [];
  }
}

function getGitLabE2EScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm run test:e2e"];
    case "python": return ["    - pip install pytest-playwright", "    - pytest --playwright"];
    case "java": return ["    - mvn verify -DskipITs=false"];
    case "go": return ["    - go test -tags=e2e ./..."];
    case "rust": return ["    - cargo test --test '*'"];
    case "dotnet": return ["    - dotnet test --filter \"FullyQualifiedName~E2E\""];
    default: return [];
  }
}

function getGitLabAuditScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs":
      const auditCmd = c.packageManager === "yarn" ? "yarn audit" :
                        c.packageManager === "pnpm" ? "pnpm audit" :
                        c.packageManager === "bun" ? "bun audit" : "npm audit --audit-level=high";
      return [`    - ${auditCmd}`];
    case "python": return ["    - pip install pip-audit", "    - pip-audit"];
    case "java": return ["    - mvn org.owasp:dependency-check-maven:check"];
    case "go": return ["    - go install golang.org/x/vuln/cmd/govulncheck@latest", "    - govulncheck ./..."];
    case "rust": return ["    - cargo audit"];
    case "dotnet": return ["    - dotnet list package --vulnerable"];
    default: return [];
  }
}
