import { PipelineConfig } from "../types";
import {
  formatYamlBranches,
  ghaExpr,
  getNodeCachePath,
  getNodeInstallCommand,
  getNodeLockfile,
  getNodeRunPrefix,
  getMonorepoCachePath,
  getPrimaryBranch,
  indent,
  shouldSkipDependencyCache,
} from "./shared";

export function generateGitHubActions(c: PipelineConfig): string {
  const lines: string[] = [];
  const branchList = formatYamlBranches(c.branches);

  lines.push(`name: ${c.projectName} CI/CD Pipeline`);
  lines.push("");
  lines.push("on:");
  lines.push(`${indent(1)}push:`);
  lines.push(`${indent(2)}branches: ${branchList}`);
  lines.push(`${indent(1)}pull_request:`);
  lines.push(`${indent(2)}branches: ${branchList}`);

  if (c.schedule?.enabled && c.schedule.cron) {
    lines.push(`${indent(1)}schedule:`);
    lines.push(`${indent(2)}- cron: '${c.schedule.cron}'`);
  }

  if (c.ciSettings?.parallelJobs) {
    lines.push("");
    lines.push("concurrency:");
    lines.push(`${indent(1)}group: ${ghaExpr("github.workflow")}-${ghaExpr("github.ref")}`);
    lines.push(`${indent(1)}cancel-in-progress: true`);
  }

  lines.push("");
  lines.push("permissions:");
  lines.push(`${indent(1)}contents: read`);
  lines.push("");
  lines.push("jobs:");
  lines.push(`${indent(1)}build:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);

  if (c.ciSettings?.timeout) {
    lines.push(`${indent(2)}timeout-minutes: ${c.ciSettings.timeout}`);
  }

  const matrixVersions =
    c.matrixBuild?.enabled && c.matrixBuild.versions && c.matrixBuild.versions.length > 0
      ? c.matrixBuild.versions
      : c.projectType === "nodejs" && c.nodeVersion
        ? [c.nodeVersion]
        : null;

  if (matrixVersions) {
    lines.push(`${indent(2)}strategy:`);
    lines.push(`${indent(3)}fail-fast: ${c.ciSettings?.retryOnFailure ? "false" : "true"}`);
    lines.push(`${indent(3)}matrix:`);
    if (c.projectType === "nodejs") {
      lines.push(
        `${indent(4)}node-version: [${matrixVersions.map((v) => `"${v}"`).join(", ")}]`
      );
    } else if (c.projectType === "python") {
      lines.push(
        `${indent(4)}python-version: [${matrixVersions.map((v) => `"${v}"`).join(", ")}]`
      );
    } else {
      lines.push(`${indent(4)}version: [${matrixVersions.map((v) => `"${v}"`).join(", ")}]`);
    }
    lines.push("");
  }

  if (c.environmentVariables && c.environmentVariables.length > 0) {
    lines.push(`${indent(2)}env:`);
    for (const { key, value } of c.environmentVariables) {
      if (key.trim()) {
        lines.push(`${indent(3)}${key}: '${value.replace(/'/g, "''")}'`);
      }
    }
    lines.push("");
  }

  if (c.services?.enabled) {
    lines.push(...getServiceContainers(c, 2));
    lines.push("");
  }

  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- uses: actions/checkout@v4`);

  if (c.customScripts?.preBuild) {
    lines.push("");
    lines.push(...getRunStep("Pre-build script", c.customScripts.preBuild, 3));
  }

  if (c.enableCaching) {
    lines.push("");
    lines.push(...getCachingSteps(c, 3));
  }

  lines.push("");
  lines.push(...getSetupSteps(c, 3));

  lines.push("");
  lines.push(...getInstallSteps(c, 3));

  if (c.enableLinting) {
    lines.push("");
    lines.push(...getLintSteps(c, 3));
  }

  if (c.enableCodeFormatting) {
    lines.push("");
    lines.push(...getFormattingSteps(c, 3));
  }

  if (c.enableTypeChecking) {
    lines.push("");
    lines.push(...getTypeCheckSteps(c, 3));
  }

  if (c.enableSecurityScan) {
    lines.push("");
    lines.push(...getSecuritySteps(c, 3));
  }

  if (c.enableDependencyAudit) {
    lines.push("");
    lines.push(...getDependencyAuditSteps(c, 3));
  }

  if (c.customScripts?.preTest) {
    lines.push("");
    lines.push(...getRunStep("Pre-test script", c.customScripts.preTest, 3));
  }

  if (c.enableTests) {
    lines.push("");
    lines.push(...getTestSteps(c, 3));
  }

  if (c.enableE2ETesting) {
    lines.push("");
    lines.push(...getE2ETestSteps(c, 3));
  }

  if (c.enableBuild) {
    lines.push("");
    lines.push(...getBuildSteps(c, 3));
  }

  if (c.customScripts?.postBuild) {
    lines.push("");
    lines.push(...getRunStep("Post-build script", c.customScripts.postBuild, 3));
  }

  if (c.artifacts?.enabled && c.artifacts.paths && c.artifacts.paths.length > 0) {
    lines.push("");
    lines.push(...getArtifactSteps(c, 3));
  }

  if (c.enableContainerScan) {
    lines.push("");
    lines.push(...getContainerScanSteps(c, 3));
  }

  if (c.enableSonarQube) {
    lines.push("");
    lines.push(...getSonarQubeSteps(c, 3));
  }

  if (c.enableDocker) {
    lines.push("");
    lines.push(...getDockerJob(c));
  }

  if (c.customActions && c.customActions.length > 0) {
    lines.push("");
    lines.push(...getCustomActions(c, 3));
  }

  if (c.deployTarget !== "none") {
    lines.push("");
    lines.push(...getDeployJob(c));
  }

  return lines.join("\n");
}

function getRunStep(name: string, script: string, depth: number): string[] {
  const lines: string[] = [];
  lines.push(`${indent(depth)}- name: ${name}`);
  lines.push(`${indent(depth)}  run: |`);
  for (const line of script.split("\n")) {
    lines.push(`${indent(depth)}    ${line}`);
  }
  return lines;
}

function getArtifactSteps(c: PipelineConfig, depth: number): string[] {
  const paths = c.artifacts?.paths?.join("\n") ?? "dist/";
  const retention = c.artifacts?.retention ?? 30;
  return [
    `${indent(depth)}- name: Upload artifacts`,
    `${indent(depth)}  uses: actions/upload-artifact@v4`,
    `${indent(depth)}  with:`,
    `${indent(depth)}    name: ${c.projectName}-artifacts`,
    `${indent(depth)}    path: |`,
    ...paths.split("\n").map((p) => `${indent(depth)}      ${p}`),
    `${indent(depth)}    retention-days: ${retention}`,
  ];
}

function getServiceContainers(c: PipelineConfig, depth: number): string[] {
  const lines: string[] = [`${indent(depth)}services:`];

  if (c.services?.database?.enabled) {
    const dbImage =
      c.services.database.type === "mysql"
        ? "mysql:8"
        : c.services.database.type === "mongodb"
          ? "mongo:7"
          : "postgres:16-alpine";
    lines.push(`${indent(depth + 1)}database:`);
    lines.push(`${indent(depth + 2)}image: ${dbImage}`);
    lines.push(`${indent(depth + 2)}ports:`);
    lines.push(`${indent(depth + 3)}- 5432:5432`);
    lines.push(`${indent(depth + 2)}env:`);
    lines.push(`${indent(depth + 3)}POSTGRES_PASSWORD: postgres`);
  }

  if (c.services?.redis) {
    lines.push(`${indent(depth + 1)}redis:`);
    lines.push(`${indent(depth + 2)}image: redis:7-alpine`);
    lines.push(`${indent(depth + 2)}ports:`);
    lines.push(`${indent(depth + 3)}- 6379:6379`);
  }

  if (c.services?.elasticsearch) {
    lines.push(`${indent(depth + 1)}elasticsearch:`);
    lines.push(`${indent(depth + 2)}image: elasticsearch:8.15.0`);
    lines.push(`${indent(depth + 2)}ports:`);
    lines.push(`${indent(depth + 3)}- 9200:9200`);
    lines.push(`${indent(depth + 2)}env:`);
    lines.push(`${indent(depth + 3)}discovery.type: single-node`);
    lines.push(`${indent(depth + 3)}xpack.security.enabled: "false"`);
  }

  return lines;
}

function getCachingSteps(c: PipelineConfig, depth: number): string[] {
  const lines: string[] = [];

  if (shouldSkipDependencyCache(c)) {
    return lines;
  }

  switch (c.projectType) {
    case "nodejs": {
      const lockFile = getNodeLockfile(c);
      const cachePath = getNodeCachePath(c);
      lines.push(`${indent(depth)}- name: Cache dependencies`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ${cachePath}`);
      lines.push(
        `${indent(depth)}    key: ${ghaExpr("runner.os")}-node-${ghaExpr(`hashFiles('**/${lockFile}')`)}`
      );
      lines.push(`${indent(depth)}    restore-keys: |`);
      lines.push(`${indent(depth)}      ${ghaExpr("runner.os")}-node-`);

      const monoPath = c.isMonorepo ? getMonorepoCachePath(c.monorepoTool) : null;
      if (monoPath) {
        lines.push(`${indent(depth)}- name: Cache monorepo`);
        lines.push(`${indent(depth)}  uses: actions/cache@v4`);
        lines.push(`${indent(depth)}  with:`);
        lines.push(`${indent(depth)}    path: ${monoPath}`);
        lines.push(
          `${indent(depth)}    key: ${ghaExpr("runner.os")}-mono-${ghaExpr("hashFiles('**/*')")}`
        );
      }
      break;
    }
    case "python":
      lines.push(`${indent(depth)}- name: Cache pip`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/.cache/pip`);
      lines.push(
        `${indent(depth)}    key: ${ghaExpr("runner.os")}-pip-${ghaExpr("hashFiles('**/requirements.txt')")}`
      );
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Cache Maven`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/.m2/repository`);
      lines.push(
        `${indent(depth)}    key: ${ghaExpr("runner.os")}-maven-${ghaExpr("hashFiles('**/pom.xml')")}`
      );
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Cache Go modules`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ~/go/pkg/mod`);
      lines.push(
        `${indent(depth)}    key: ${ghaExpr("runner.os")}-go-${ghaExpr("hashFiles('**/go.sum')")}`
      );
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
      if (c.matrixBuild?.enabled && c.matrixBuild.versions?.length) {
        lines.push(`${indent(depth)}    node-version: ${ghaExpr("matrix.node-version")}`);
      } else {
        lines.push(`${indent(depth)}    node-version: ${c.nodeVersion || "20"}`);
      }
      if (c.packageManager === "pnpm") {
        lines.push(`${indent(depth)}    cache: pnpm`);
      } else if (c.packageManager === "yarn") {
        lines.push(`${indent(depth)}    cache: yarn`);
      } else if (c.packageManager === "npm") {
        lines.push(`${indent(depth)}    cache: npm`);
      }
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
    case "nodejs": {
      if (c.packageManager === "pnpm") {
        lines.push(`${indent(depth)}- name: Enable pnpm`);
        lines.push(`${indent(depth)}  uses: pnpm/action-setup@v4`);
        lines.push(`${indent(depth)}  with:`);
        lines.push(`${indent(depth)}    version: 9`);
      }
      lines.push(`${indent(depth)}- name: Install dependencies`);
      lines.push(`${indent(depth)}  run: ${getNodeInstallCommand(c)}`);
      if (c.isMonorepo && c.monorepoTool && c.monorepoTool !== "none") {
        lines.push(`${indent(depth)}- name: Bootstrap monorepo`);
        lines.push(`${indent(depth)}  run: npx ${c.monorepoTool} run-many --target=build --dry-run || true`);
      }
      break;
    }
    case "python":
      if (c.packageManager === "poetry") {
        lines.push(`${indent(depth)}- name: Install dependencies`);
        lines.push(`${indent(depth)}  run: |`);
        lines.push(`${indent(depth)}    pip install poetry`);
        lines.push(`${indent(depth)}    poetry install`);
      } else {
        lines.push(`${indent(depth)}- name: Install dependencies`);
        lines.push(`${indent(depth)}  run: |`);
        lines.push(`${indent(depth)}    python -m pip install --upgrade pip`);
        lines.push(`${indent(depth)}    pip install -r requirements.txt`);
      }
      break;
    case "java":
      if (c.packageManager === "gradle") {
        lines.push(`${indent(depth)}- name: Install dependencies`);
        lines.push(`${indent(depth)}  run: ./gradlew dependencies`);
      } else {
        lines.push(`${indent(depth)}- name: Install dependencies`);
        lines.push(`${indent(depth)}  run: mvn dependency:resolve`);
      }
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
      lines.push(`${indent(depth)}  run: ${getNodeRunPrefix(c)} lint`);
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

  // Add parallel test execution if optimization is enabled
  if (c.optimization?.enabled && c.optimization.parallelizeTests) {
    lines.push(`${indent(depth)}- name: Run tests in parallel`);
    lines.push(`${indent(depth)}  run: |`);
    switch (c.projectType) {
      case "nodejs":
        lines.push(`${indent(depth)}    npx jest --maxWorkers=4`);
        break;
      case "python":
        lines.push(`${indent(depth)}    pip install pytest-xdist`);
        lines.push(`${indent(depth)}    pytest -n auto`);
        break;
      case "java":
        lines.push(`${indent(depth)}    mvn test -T 4`);
        break;
      case "go":
        lines.push(`${indent(depth)}    go test -parallel 4 ./...`);
        break;
      case "rust":
        lines.push(`${indent(depth)}    cargo test --jobs 4`);
        break;
      case "dotnet":
        lines.push(`${indent(depth)}    dotnet test --parallel`);
        break;
    }
  } else {
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
  }
  return lines;
}

function getBuildSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Build`);
      lines.push(`${indent(depth)}  run: ${getNodeRunPrefix(c)} build`);
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
  const imageName = c.dockerImageName || c.projectName;
  const dockerPath = c.dockerfilePath || ".";
  const primaryBranch = getPrimaryBranch(c);

  lines.push(`${indent(1)}docker:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  lines.push(`${indent(2)}needs: build`);
  lines.push(`${indent(2)}if: github.ref == 'refs/heads/${primaryBranch}'`);
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
  lines.push(`${indent(3)}    username: ${ghaExpr("secrets.DOCKER_USERNAME")}`);
  lines.push(`${indent(3)}    password: ${ghaExpr("secrets.DOCKER_PASSWORD")}`);
  lines.push("");
  lines.push(`${indent(3)}- name: Build and push`);
  lines.push(`${indent(3)}  uses: docker/build-push-action@v5`);
  lines.push(`${indent(3)}  with:`);
  lines.push(`${indent(3)}    context: ${dockerPath}`);
  lines.push(`${indent(3)}    push: true`);
  lines.push(
    `${indent(3)}    tags: ${imageName}:${ghaExpr("github.sha")},${imageName}:latest`
  );
  if (c.optimization?.useBuildKit) {
    lines.push(`${indent(3)}    build-args: |`);
    lines.push(`${indent(3)}      BUILDKIT_INLINE_CACHE=1`);
  }

  return lines;
}

function getDeployJob(c: PipelineConfig): string[] {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);
  const needs = c.enableDocker ? "docker" : "build";

  // Multi-environment support
  if (c.environments?.enabled && c.environments.stages && c.environments.stages.length > 0) {
    for (const stage of c.environments.stages) {
      lines.push(`${indent(1)}deploy-${stage.name.toLowerCase()}:`);
      lines.push(`${indent(2)}runs-on: ubuntu-latest`);
      lines.push(`${indent(2)}needs: ${needs}`);
      lines.push(`${indent(2)}if: github.ref == 'refs/heads/${stage.branch}'`);
      lines.push(`${indent(2)}environment:`);
      lines.push(`${indent(3)}name: ${stage.name}`);
      if (stage.requireApproval) {
        lines.push(`${indent(3)}url: https://github.com`);
      }
      
      lines.push("");
      lines.push(`${indent(2)}steps:`);
      lines.push(`${indent(3)}- uses: actions/checkout@v4`);
      lines.push("");
      lines.push(...getDeploySteps(c, 3, stage.name));
      lines.push("");
    }
  } else {
    lines.push(`${indent(1)}deploy:`);
    lines.push(`${indent(2)}runs-on: ubuntu-latest`);
    lines.push(`${indent(2)}needs: ${needs}`);
    lines.push(`${indent(2)}if: github.ref == 'refs/heads/${getPrimaryBranch(c)}'`);
    lines.push(`${indent(2)}environment: production`);
    lines.push("");
    lines.push(`${indent(2)}steps:`);
    lines.push(`${indent(3)}- uses: actions/checkout@v4`);
    lines.push("");
    lines.push(...getDeploySteps(c, 3, "production"));
  }

  return lines;
}

function getDeploySteps(c: PipelineConfig, depth: number, environment: string): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.deployTarget) {
    case "aws":
      lines.push(`${indent(depth)}- name: Configure AWS Credentials`);
      lines.push(`${indent(depth)}  uses: aws-actions/configure-aws-credentials@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    aws-access-key-id: ${ghaExpr("secrets.AWS_ACCESS_KEY_ID")}`);
      lines.push(`${indent(depth)}    aws-secret-access-key: ${ghaExpr("secrets.AWS_SECRET_ACCESS_KEY")}`);
      lines.push(`${indent(depth)}    aws-region: ${ghaExpr("secrets.AWS_REGION")}`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to AWS ECS`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    aws ecs update-service \\`);
      lines.push(`${indent(depth)}      --cluster ${ghaExpr("secrets.AWS_CLUSTER")} \\`);
      lines.push(`${indent(depth)}      --service ${ghaExpr("secrets.AWS_SERVICE")} \\`);
      
      if (c.deploymentStrategy === 'rolling') {
        lines.push(`${indent(depth)}      --deployment-configuration maximumPercent=200,minimumHealthyPercent=100`);
      } else if (c.deploymentStrategy === 'blue-green') {
        lines.push(`${indent(depth)}      --deployment-configuration deploymentCircuitBreaker={enable=true,rollback=true}`);
      }
      
      lines.push(`${indent(depth)}      --force-new-deployment`);
      break;
      
    case "kubernetes":
      lines.push(`${indent(depth)}- name: Setup kubectl`);
      lines.push(`${indent(depth)}  uses: azure/setup-kubectl@v4`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Set Kubernetes context`);
      lines.push(`${indent(depth)}  uses: azure/k8s-set-context@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    kubeconfig: ${ghaExpr("secrets.KUBE_CONFIG")}`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to Kubernetes`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    kubectl apply -f k8s/`);
      
      if (c.deploymentStrategy === 'rolling') {
        lines.push(
          `${indent(depth)}    kubectl rollout status deployment/${ghaExpr("secrets.K8S_DEPLOYMENT")}`
        );
      } else if (c.deploymentStrategy === 'canary') {
        lines.push(`${indent(depth)}    kubectl apply -f k8s/canary/`);
      } else if (c.deploymentStrategy === 'blue-green') {
        lines.push(`${indent(depth)}    kubectl apply -f k8s/blue-green/`);
      }
      break;
      
    case "vercel":
      lines.push(`${indent(depth)}- name: Deploy to Vercel`);
      lines.push(`${indent(depth)}  uses: amondnet/vercel-action@v25`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    vercel-token: ${ghaExpr("secrets.VERCEL_TOKEN")}`);
      lines.push(`${indent(depth)}    vercel-org-id: ${ghaExpr("secrets.VERCEL_ORG_ID")}`);
      lines.push(`${indent(depth)}    vercel-project-id: ${ghaExpr("secrets.VERCEL_PROJECT_ID")}`);
      lines.push(`${indent(depth)}    vercel-args: '--prod'`);
      break;
      
    case "netlify":
      lines.push(`${indent(depth)}- name: Deploy to Netlify`);
      lines.push(`${indent(depth)}  uses: nwtgck/actions-netlify@v2.1`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    publish-dir: './dist'`);
      lines.push(`${indent(depth)}    production-branch: main`);
      lines.push(`${indent(depth)}    github-token: ${ghaExpr("secrets.GITHUB_TOKEN")}`);
      lines.push(`${indent(depth)}    deploy-message: "Deploy from GitHub Actions"`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    NETLIFY_AUTH_TOKEN: ${ghaExpr("secrets.NETLIFY_AUTH_TOKEN")}`);
      lines.push(`${indent(depth)}    NETLIFY_SITE_ID: ${ghaExpr("secrets.NETLIFY_SITE_ID")}`);
      break;
      
    case "fly-io":
      lines.push(`${indent(depth)}- name: Deploy to Fly.io`);
      lines.push(`${indent(depth)}  uses: superfly/flyctl-actions/setup-flyctl@master`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to Fly.io`);
      lines.push(`${indent(depth)}  run: flyctl deploy --remote-only`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    FLY_API_TOKEN: ${ghaExpr("secrets.FLY_API_TOKEN")}`);
      break;
      
    case "railway":
      lines.push(`${indent(depth)}- name: Deploy to Railway`);
      lines.push(`${indent(depth)}  uses: railwayapp/cli-action@v1.0.0`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    railway-token: ${ghaExpr("secrets.RAILWAY_TOKEN")}`);
      lines.push(`${indent(depth)}    service: ${ghaExpr("secrets.RAILWAY_SERVICE_ID")}`);
      break;
      
    case "cloudflare-pages":
      lines.push(`${indent(depth)}- name: Deploy to Cloudflare Pages`);
      lines.push(`${indent(depth)}  uses: cloudflare/wrangler-action@v3`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    apiToken: ${ghaExpr("secrets.CLOUDFLARE_API_TOKEN")}`);
      lines.push(`${indent(depth)}    accountId: ${ghaExpr("secrets.CLOUDFLARE_ACCOUNT_ID")}`);
      lines.push(`${indent(depth)}    command: pages deploy dist --project-name=${c.projectName}`);
      break;
      
    case "digitalocean":
      lines.push(`${indent(depth)}- name: Deploy to DigitalOcean App Platform`);
      lines.push(`${indent(depth)}  uses: digitalocean/app_action@v2.0.0`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    app_name: ${c.projectName}`);
      lines.push(`${indent(depth)}    token: ${ghaExpr("secrets.DIGITALOCEAN_ACCESS_TOKEN")}`);
      break;
      
    case "heroku":
      lines.push(`${indent(depth)}- name: Deploy to Heroku`);
      lines.push(`${indent(depth)}  uses: akhileshns/heroku-deploy@v3.13.15`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    heroku_api_key: ${ghaExpr("secrets.HEROKU_API_KEY")}`);
      lines.push(`${indent(depth)}    heroku_app_name: ${ghaExpr("secrets.HEROKU_APP_NAME")}`);
      lines.push(`${indent(depth)}    heroku_email: ${ghaExpr("secrets.HEROKU_EMAIL")}`);
      break;
      
    case "azure":
      lines.push(`${indent(depth)}- name: Deploy to Azure App Service`);
      lines.push(`${indent(depth)}  uses: azure/webapps-deploy@v2`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    app-name: ${ghaExpr("secrets.AZURE_WEBAPP_NAME")}`);
      lines.push(`${indent(depth)}    publish-profile: ${ghaExpr("secrets.AZURE_WEBAPP_PUBLISH_PROFILE")}`);
      lines.push(`${indent(depth)}    package: ./dist`);
      break;
      
    case "gcp":
      lines.push(`${indent(depth)}- name: Deploy to Google Cloud Run`);
      lines.push(`${indent(depth)}  uses: google-github-actions/deploy-cloudrun@v2`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    service: ${c.projectName}`);
      lines.push(`${indent(depth)}    region: ${ghaExpr("secrets.GCP_REGION")}`);
      lines.push(`${indent(depth)}    source: ./`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    GOOGLE_CREDENTIALS: ${ghaExpr("secrets.GCP_CREDENTIALS")}`);
      break;
  }

  return lines;
}

function getFormattingSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: ${getNodeRunPrefix(c)} format:check`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install black`);
      lines.push(`${indent(depth)}    black --check .`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: mvn spotless:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: gofmt -l .`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: cargo fmt -- --check`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: dotnet format --verify-no-changes`);
      break;
  }
  return lines;
}

function getTypeCheckSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: npx tsc --noEmit`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install mypy`);
      lines.push(`${indent(depth)}    mypy .`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: mvn compiler:compile`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: go build ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: cargo check`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Type check`);
      lines.push(`${indent(depth)}  run: dotnet build --no-restore`);
      break;
  }
  return lines;
}

function getDependencyAuditSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      const auditCmd = c.packageManager === "yarn" ? "yarn audit" :
                        c.packageManager === "pnpm" ? "pnpm audit" :
                        c.packageManager === "bun" ? "bun audit" : "npm audit --audit-level=high";
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: ${auditCmd}`);
      break;
    case "python":
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    pip install pip-audit`);
      lines.push(`${indent(depth)}    pip-audit`);
      break;
    case "java":
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: mvn org.owasp:dependency-check-maven:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    go install golang.org/x/vuln/cmd/govulncheck@latest`);
      lines.push(`${indent(depth)}    govulncheck ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: cargo audit`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- name: Dependency audit`);
      lines.push(`${indent(depth)}  run: dotnet list package --vulnerable`);
      break;
  }
  return lines;
}

function getE2ETestSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- name: Run E2E tests`);
  lines.push(`${indent(depth)}  run: |`);
  
  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm run test:e2e`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install pytest-playwright`);
      lines.push(`${indent(depth)}    pytest --playwright`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn verify -DskipITs=false`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go test -tags=e2e ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo test --test '*'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet test --filter "FullyQualifiedName~E2E"`);
      break;
  }
  return lines;
}

function getContainerScanSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- name: Container scan`);
  lines.push(`${indent(depth)}  uses: aquasecurity/trivy-action@master`);
  lines.push(`${indent(depth)}  with:`);
  lines.push(`${indent(depth)}    image-ref: ${c.dockerImageName || c.projectName}:latest`);
  lines.push(`${indent(depth)}    format: 'sarif'`);
  lines.push(`${indent(depth)}    output: 'trivy-results.sarif'`);
  return lines;
}

function getSonarQubeSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- name: SonarQube Scan`);
  lines.push(`${indent(depth)}  uses: sonarsource/sonarqube-scan-action@master`);
  lines.push(`${indent(depth)}  env:`);
  lines.push(`${indent(depth)}    SONAR_TOKEN: ${ghaExpr("secrets.SONAR_TOKEN")}`);
  lines.push(`${indent(depth)}    SONAR_HOST_URL: ${ghaExpr("secrets.SONAR_HOST_URL")}`);
  
  if (c.codeQuality?.qualityGate) {
    lines.push(`${indent(depth)}- name: SonarQube Quality Gate`);
    lines.push(`${indent(depth)}  uses: sonarsource/sonarqube-quality-gate-action@master`);
    lines.push(`${indent(depth)}  timeout-minutes: 5`);
  }
  return lines;
}

function getCustomActions(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  if (!c.customActions || c.customActions.length === 0) return lines;

  for (const action of c.customActions) {
    lines.push(`${indent(depth)}- name: ${action.name}`);
    lines.push(`${indent(depth)}  uses: ${action.uses}`);
    
    if (action.with && Object.keys(action.with).length > 0) {
      lines.push(`${indent(depth)}  with:`);
      for (const [key, value] of Object.entries(action.with)) {
        lines.push(`${indent(depth)}    ${key}: ${value}`);
      }
    }
    
    // Add conditional execution if specified
    if (c.conditionalSteps?.enabled && c.conditionalSteps.rules) {
      const rule = c.conditionalSteps.rules.find(r => r.step === action.name);
      if (rule) {
        lines.push(`${indent(depth)}  if: ${getConditionExpression(rule)}`);
      }
    }
    
    lines.push("");
  }

  return lines;
}

function getConditionExpression(rule: { condition: string; value: string }): string {
  switch (rule.condition) {
    case 'branch':
      return `github.ref == 'refs/heads/${rule.value}'`;
    case 'path':
      return `contains(github.event.head_commit.modified, '${rule.value}')`;
    case 'event':
      return `github.event_name == '${rule.value}'`;
    case 'custom':
      return rule.value;
    default:
      return 'true';
  }
}
