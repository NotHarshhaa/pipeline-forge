import { PipelineConfig } from "../types";

export function generateGitLabCI(c: PipelineConfig): string {
  const lines: string[] = [];

  lines.push(`# ${c.projectName} GitLab CI/CD Pipeline`);
  lines.push("");
  lines.push("stages:");
  const stages = ["build"];
  if (c.enableLinting) stages.push("lint");
  if (c.enableTests) stages.push("test");
  if (c.enableSecurityScan) stages.push("security");
  if (c.enableDocker) stages.push("docker");
  if (c.deployTarget !== "none") stages.push("deploy");
  for (const s of stages) {
    lines.push(`  - ${s}`);
  }
  lines.push("");

  lines.push("variables:");
  if (c.projectType === "nodejs") {
    lines.push(`  NODE_VERSION: "${c.nodeVersion || "20"}"`);
  } else if (c.projectType === "python") {
    lines.push(`  PYTHON_VERSION: "${c.pythonVersion || "3.12"}"`);
  } else if (c.projectType === "java") {
    lines.push(`  JAVA_VERSION: "${c.javaVersion || "17"}"`);
  }
  lines.push("");

  const image = getGitLabImage(c);
  lines.push(`image: ${image}`);
  lines.push("");

  if (c.enableCaching) {
    lines.push("cache:");
    lines.push(`  paths:`);
    lines.push(...getGitLabCachePaths(c));
    lines.push("");
  }

  lines.push("build:");
  lines.push("  stage: build");
  lines.push("  script:");
  lines.push(...getGitLabInstallScript(c));
  if (c.enableBuild) {
    lines.push(...getGitLabBuildScript(c));
  }
  lines.push("");

  if (c.enableLinting) {
    lines.push("lint:");
    lines.push("  stage: lint");
    lines.push("  script:");
    lines.push(...getGitLabLintScript(c));
    lines.push("");
  }

  if (c.enableTests) {
    lines.push("test:");
    lines.push("  stage: test");
    lines.push("  script:");
    lines.push(...getGitLabTestScript(c));
    lines.push("");
  }

  if (c.enableSecurityScan) {
    lines.push("security_scan:");
    lines.push("  stage: security");
    lines.push("  script:");
    lines.push(...getGitLabSecurityScript(c));
    lines.push("  allow_failure: true");
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
    case "nodejs": return ["    - node_modules/"];
    case "python": return ["    - .cache/pip/"];
    case "java": return ["    - .m2/repository/"];
    case "go": return ["    - /go/pkg/mod/"];
    default: return [];
  }
}

function getGitLabInstallScript(c: PipelineConfig): string[] {
  switch (c.projectType) {
    case "nodejs": return ["    - npm ci"];
    case "python": return ["    - pip install -r requirements.txt"];
    case "java": return ["    - mvn dependency:resolve"];
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
