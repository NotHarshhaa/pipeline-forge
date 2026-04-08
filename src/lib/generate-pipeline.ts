export interface PipelineConfig {
  projectName: string;
  projectType: "nodejs" | "python" | "java" | "go" | "rust" | "dotnet";
  ciProvider: "github-actions" | "gitlab-ci";
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
}

const defaults: Record<string, Partial<PipelineConfig>> = {
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

export function generatePipeline(config: PipelineConfig): string {
  if (config.ciProvider === "github-actions") {
    return generateGitHubActions(config);
  }
  return generateGitLabCI(config);
}

function generateGitHubActions(c: PipelineConfig): string {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);

  lines.push(`name: ${c.projectName} CI/CD Pipeline`);
  lines.push("");
  lines.push("on:");
  lines.push(`${indent(1)}push:`);
  lines.push(`${indent(2)}branches: [${c.branches.join(", ")}]`);
  lines.push(`${indent(1)}pull_request:`);
  lines.push(`${indent(2)}branches: [${c.branches.join(", ")}]`);
  lines.push("");
  lines.push("jobs:");

  // Build & Test job
  lines.push(`${indent(1)}build:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  lines.push("");

  // Strategy matrix for some languages
  if (c.projectType === "nodejs" && c.nodeVersion) {
    lines.push(`${indent(2)}strategy:`);
    lines.push(`${indent(3)}matrix:`);
    lines.push(`${indent(4)}node-version: [${c.nodeVersion}]`);
    lines.push("");
  }

  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- uses: actions/checkout@v4`);

  // Caching
  if (c.enableCaching) {
    lines.push("");
    lines.push(...getCachingSteps(c, 3));
  }

  // Setup step
  lines.push("");
  lines.push(...getSetupSteps(c, 3));

  // Install dependencies
  lines.push("");
  lines.push(...getInstallSteps(c, 3));

  // Linting
  if (c.enableLinting) {
    lines.push("");
    lines.push(...getLintSteps(c, 3));
  }

  // Security scan
  if (c.enableSecurityScan) {
    lines.push("");
    lines.push(...getSecuritySteps(c, 3));
  }

  // Tests
  if (c.enableTests) {
    lines.push("");
    lines.push(...getTestSteps(c, 3));
  }

  // Build
  if (c.enableBuild) {
    lines.push("");
    lines.push(...getBuildSteps(c, 3));
  }

  // Docker job
  if (c.enableDocker) {
    lines.push("");
    lines.push(...getDockerJob(c));
  }

  // Deploy job
  if (c.deployTarget !== "none") {
    lines.push("");
    lines.push(...getDeployJob(c));
  }

  return lines.join("\n");
}

function generateGitLabCI(c: PipelineConfig): string {
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

  // Variables
  lines.push("variables:");
  if (c.projectType === "nodejs") {
    lines.push(`  NODE_VERSION: "${c.nodeVersion || "20"}"`);
  } else if (c.projectType === "python") {
    lines.push(`  PYTHON_VERSION: "${c.pythonVersion || "3.12"}"`);
  } else if (c.projectType === "java") {
    lines.push(`  JAVA_VERSION: "${c.javaVersion || "17"}"`);
  }
  lines.push("");

  // Image
  const image = getGitLabImage(c);
  lines.push(`image: ${image}`);
  lines.push("");

  // Cache
  if (c.enableCaching) {
    lines.push("cache:");
    lines.push(`  paths:`);
    lines.push(...getGitLabCachePaths(c));
    lines.push("");
  }

  // Build job
  lines.push("build:");
  lines.push("  stage: build");
  lines.push("  script:");
  lines.push(...getGitLabInstallScript(c));
  if (c.enableBuild) {
    lines.push(...getGitLabBuildScript(c));
  }
  lines.push("");

  // Lint
  if (c.enableLinting) {
    lines.push("lint:");
    lines.push("  stage: lint");
    lines.push("  script:");
    lines.push(...getGitLabLintScript(c));
    lines.push("");
  }

  // Test
  if (c.enableTests) {
    lines.push("test:");
    lines.push("  stage: test");
    lines.push("  script:");
    lines.push(...getGitLabTestScript(c));
    lines.push("");
  }

  // Security
  if (c.enableSecurityScan) {
    lines.push("security_scan:");
    lines.push("  stage: security");
    lines.push("  script:");
    lines.push(...getGitLabSecurityScript(c));
    lines.push("  allow_failure: true");
    lines.push("");
  }

  // Docker
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

  // Deploy
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

// --- Helper functions for GitHub Actions ---

function getCachingSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Cache node_modules`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/.npm`);
      lines.push(`${indent(depth)}    key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}`);
      lines.push(`${indent(depth)}    restore-keys: |`);
      lines.push(`${indent(depth)}      \${{ runner.os }}-node-`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Cache pip`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/.cache/pip`);
      lines.push(`${indent(depth)}    key: \${{ runner.os }}-pip-\${{ hashFiles('**/requirements.txt') }}`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Cache Maven`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/.m2/repository`);
      lines.push(`${indent(depth)}    key: \${{ runner.os }}-maven-\${{ hashFiles('**/pom.xml') }}`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Cache Go modules`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/go/pkg/mod`);
      lines.push(`${indent(depth)}    key: \${{ runner.os }}-go-\${{ hashFiles('**/go.sum') }}`);
      break;
    default:
      break;
  }
  return lines;
}

function getSetupSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Setup Node.js`);
      lines.push(`${indent(depth)}  uses: actions/setup-node@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    node-version: ${c.nodeVersion || "20"}`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Setup Python`);
      lines.push(`${indent(depth)}  uses: actions/setup-python@v5`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    python-version: "${c.pythonVersion || "3.12"}"`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Setup Java`);
      lines.push(`${indent(depth)}  uses: actions/setup-java@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    distribution: temurin`);
      lines.push(`${indent(depth)}    java-version: "${c.javaVersion || "17"}"`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Setup Go`);
      lines.push(`${indent(depth)}  uses: actions/setup-go@v5`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    go-version: "${c.goVersion || "1.22"}"`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Setup Rust`);
      lines.push(`${indent(depth)}  uses: dtolnay/rust-toolchain@stable`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Setup .NET`);
      lines.push(`${indent(depth)}  uses: actions/setup-dotnet@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    dotnet-version: "8.0.x"`);
      break;
  }
  return lines;
}

function getInstallSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Install dependencies`);
      lines.push(`${indent(depth)}  run: npm ci`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Install dependencies`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    python -m pip install --upgrade pip`);
      lines.push(`${indent(depth)}    pip install -r requirements.txt`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Install dependencies`);
      lines.push(`${indent(depth)}  run: mvn dependency:resolve`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Download dependencies`);
      lines.push(`${indent(depth)}  run: go mod download`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Fetch dependencies`);
      lines.push(`${indent(depth)}  run: cargo fetch`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Restore dependencies`);
      lines.push(`${indent(depth)}  run: dotnet restore`);
      break;
  }
  return lines;
}

function getLintSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Run linter`);
      lines.push(`${indent(depth)}  run: npm run lint`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Run linter`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install flake8`);
      lines.push(`${indent(depth)}    flake8 .`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Run checkstyle`);
      lines.push(`${indent(depth)}  run: mvn checkstyle:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Run linter`);
      lines.push(`${indent(depth)}  uses: golangci/golangci-lint-action@v4`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Run clippy`);
      lines.push(`${indent(depth)}  run: cargo clippy -- -D warnings`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Run format check`);
      lines.push(`${indent(depth)}  run: dotnet format --verify-no-changes`);
      break;
  }
  return lines;
}

function getSecuritySteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Security audit`);
      lines.push(`${indent(depth)}  run: npm audit --audit-level=high`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Security scan`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install safety`);
      lines.push(`${indent(depth)}    safety check`);
      break;
    default:
      lines.push(`${indent(depth)}- name: Security scan`);
      lines.push(`${indent(depth)}  uses: github/codeql-action/analyze@v3`);
      break;
  }
  return lines;
}

function getTestSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: npm test`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install pytest`);
      lines.push(`${indent(depth)}    pytest`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: mvn test`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: go test ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: cargo test`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Run tests`);
      lines.push(`${indent(depth)}  run: dotnet test`);
      break;
  }
  return lines;
}

function getBuildSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: npm run build`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Build package`);
      lines.push(`${indent(depth)}  run: python setup.py sdist bdist_wheel`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: mvn package -DskipTests`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: go build ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: cargo build --release`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: dotnet build --configuration Release`);
      break;
  }
  return lines;
}

function getDockerJob(c: PipelineConfig): string[] {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);
  const imageName = c.dockerImageName || c.projectName;
  const dockerPath = c.dockerfilePath || ".";

  lines.push(`${indent(1)}docker:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  lines.push(`${indent(2)}needs: build`);
  lines.push(`${indent(2)}if: github.ref == 'refs/heads/main'`);
  lines.push("");
  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- uses: actions/checkout@v4`);
  lines.push("");
  lines.push(`${indent(3)}- name: Set up Docker Buildx`);
  lines.push(`${indent(3)}  uses: docker/setup-buildx-action@v3`);
  lines.push("");
  lines.push(`${indent(3)}- name: Login to Docker Hub`);
  lines.push(`${indent(3)}  uses: docker/login-action@v3`);
  lines.push(`${indent(3)}  with:`);
  lines.push(`${indent(3)}    username: \${{ secrets.DOCKER_USERNAME }}`);
  lines.push(`${indent(3)}    password: \${{ secrets.DOCKER_PASSWORD }}`);
  lines.push("");
  lines.push(`${indent(3)}- name: Build and push`);
  lines.push(`${indent(3)}  uses: docker/build-push-action@v5`);
  lines.push(`${indent(3)}  with:`);
  lines.push(`${indent(3)}    context: ${dockerPath}`);
  lines.push(`${indent(3)}    push: true`);
  lines.push(`${indent(3)}    tags: ${imageName}:\${{ github.sha }},${imageName}:latest`);

  return lines;
}

function getDeployJob(c: PipelineConfig): string[] {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);
  const needs = c.enableDocker ? "docker" : "build";

  lines.push(`${indent(1)}deploy:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  lines.push(`${indent(2)}needs: ${needs}`);
  lines.push(`${indent(2)}if: github.ref == 'refs/heads/main'`);
  lines.push(`${indent(2)}environment: production`);
  lines.push("");
  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- uses: actions/checkout@v4`);

  if (c.deployTarget === "aws") {
    lines.push("");
    lines.push(`${indent(3)}- name: Configure AWS Credentials`);
    lines.push(`${indent(3)}  uses: aws-actions/configure-aws-credentials@v4`);
    lines.push(`${indent(3)}  with:`);
    lines.push(`${indent(3)}    aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}`);
    lines.push(`${indent(3)}    aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}`);
    lines.push(`${indent(3)}    aws-region: \${{ secrets.AWS_REGION }}`);
    lines.push("");
    lines.push(`${indent(3)}- name: Deploy to AWS ECS`);
    lines.push(`${indent(3)}  run: |`);
    lines.push(`${indent(3)}    aws ecs update-service \\`);
    lines.push(`${indent(3)}      --cluster \${{ secrets.AWS_CLUSTER }} \\`);
    lines.push(`${indent(3)}      --service \${{ secrets.AWS_SERVICE }} \\`);
    lines.push(`${indent(3)}      --force-new-deployment`);
  } else if (c.deployTarget === "kubernetes") {
    lines.push("");
    lines.push(`${indent(3)}- name: Setup kubectl`);
    lines.push(`${indent(3)}  uses: azure/setup-kubectl@v4`);
    lines.push("");
    lines.push(`${indent(3)}- name: Set Kubernetes context`);
    lines.push(`${indent(3)}  uses: azure/k8s-set-context@v4`);
    lines.push(`${indent(3)}  with:`);
    lines.push(`${indent(3)}    kubeconfig: \${{ secrets.KUBE_CONFIG }}`);
    lines.push("");
    lines.push(`${indent(3)}- name: Deploy to Kubernetes`);
    lines.push(`${indent(3)}  run: |`);
    lines.push(`${indent(3)}    kubectl apply -f k8s/`);
    lines.push(`${indent(3)}    kubectl rollout status deployment/\${{ secrets.K8S_DEPLOYMENT }}`);
  }

  return lines;
}

// --- Helper functions for GitLab CI ---

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
