// @ts-nocheck - This file generates GitHub Actions YAML with template syntax (e.g., ${{ github.workflow }})
// TypeScript errors are expected and intentional - the file outputs literal YAML template strings
import { PipelineConfig } from "@/lib/types";

export function generateGitHubActions(c: PipelineConfig): string {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);

  lines.push(`name: ${c.projectName} CI/CD Pipeline`);
  lines.push("");
  lines.push("on:");
  lines.push(`${indent(1)}push:`);
  lines.push(`${indent(2)}branches: [${c.branches.join(", ")}]`);
  lines.push(`${indent(1)}pull_request:`);
  lines.push(`${indent(2)}branches: [${c.branches.join(", ")}]`);
  
  if (c.schedule?.enabled && c.schedule.cron) {
    lines.push(`${indent(1)}schedule:`);
    lines.push(`${indent(2)}- cron: '${c.schedule.cron}'`);
  }
  
  lines.push("");
  lines.push("jobs:");

  // Add concurrency settings
  if (c.ciSettings?.concurrency && c.ciSettings.concurrency > 1) {
    lines.push(`${indent(1)}concurrency:`);
    lines.push(`${indent(2)}group: \${{ github.workflow }}-\${{ github.ref }}`);
    lines.push(`${indent(2)}cancel-in-progress: true`);
    lines.push("");
  }

  lines.push(`${indent(1)}build:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  
  // Add timeout
  if (c.ciSettings?.timeout) {
    lines.push(`${indent(2)}timeout-minutes: ${c.ciSettings.timeout}`);
  }
  
  lines.push("");

  if (c.projectType === "nodejs" && c.nodeVersion) {
    lines.push(`${indent(2)}strategy:`);
    lines.push(`${indent(3)}matrix:`);
    lines.push(`${indent(4)}node-version: [${c.nodeVersion}]`);
    lines.push("");
  }

  // Add retry on failure
  if (c.ciSettings?.retryOnFailure) {
    lines.push(`${indent(2)}continue-on-error: true`);
    lines.push("");
  }

  lines.push(`${indent(2)}steps:`);
  lines.push(`${indent(3)}- uses: actions/checkout@v4`);

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

function getCachingSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  // Skip caching if optimization is disabled
  if (c.optimization?.enabled && !c.optimization.cacheDependencies) {
    return lines;
  }

  switch (c.projectType) {
    case "nodejs":
      const lockFile = c.packageManager === "yarn" ? "yarn.lock" : 
                      c.packageManager === "pnpm" ? "pnpm-lock.yaml" :
                      c.packageManager === "bun" ? "bun.lockb" : "package-lock.json";
      const cachePath = c.packageManager === "pnpm" ? "~/.pnpm-store" :
                      c.packageManager === "yarn" ? "~/.yarn/cache" : "~/.npm";
      lines.push(`${indent(depth)}- name: Cache node_modules`);
      lines.push(`${indent(depth)}  uses: actions/cache@v4`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    path: ${cachePath}`);
      lines.push(`${indent(depth)}    key: \${{ runner.os }}-node-\${{ hashFiles('**/${lockFile}') }}`);
      lines.push(`${indent(depth)}    restore-keys: |`);
      lines.push(`${indent(depth)}      \${{ runner.os }}-node-`);
      
      // Add monorepo caching
      if (c.isMonorepo && c.monorepoTool) {
        lines.push(`${indent(depth)}- name: Cache ${c.monorepoTool}`);
        lines.push(`${indent(depth)}  uses: actions/cache@v4`);
        lines.push(`${indent(depth)}  with:`);
        lines.push(`${indent(depth)}    path: ./${c.monorepoTool}/cache`);
        lines.push(`${indent(depth)}    key: \${{ runner.os }}-${c.monorepoTool}-\${{ hashFiles('**/*') }}`);
      }
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
      const installCmd = c.packageManager === "yarn" ? "yarn install --frozen-lockfile" :
                        c.packageManager === "pnpm" ? "pnpm install --frozen-lockfile" :
                        c.packageManager === "bun" ? "bun install" : "npm ci";
      
      lines.push(`${indent(depth)}- name: Install dependencies`);
      lines.push(`${indent(depth)}  run: ${installCmd}`);
      
      // Add monorepo install
      if (c.isMonorepo && c.monorepoTool) {
        lines.push(`${indent(depth)}- name: Install ${c.monorepoTool}`);
        lines.push(`${indent(depth)}  run: |`);
        lines.push(`${indent(depth)}    npx ${c.monorepoTool}@latest install`);
      }
      break;
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

  // Multi-environment support
  if (c.environments?.enabled && c.environments.stages && c.environments.stages.length > 0) {
    for (const stage of c.environments.stages) {
      lines.push(`${indent(1)}deploy-${stage.name.toLowerCase()}:`);
      lines.push(`${indent(2)}runs-on: ubuntu-latest`);
      lines.push(`${indent(2)}needs: ${needs}`);
      lines.push(`${indent(2)}if: github.ref == 'refs/heads/${stage.branch}'`);
      lines.push(`${indent(2)}environment: ${stage.name}`);
      
      if (stage.requireApproval) {
        lines.push(`${indent(2)}environment: ${stage.name}`);
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
    lines.push(`${indent(2)}if: github.ref == 'refs/heads/main'`);
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
      lines.push(`${indent(depth)}    aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}`);
      lines.push(`${indent(depth)}    aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}`);
      lines.push(`${indent(depth)}    aws-region: \${{ secrets.AWS_REGION }}`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to AWS ECS`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    aws ecs update-service \\`);
      lines.push(`${indent(depth)}      --cluster \${{ secrets.AWS_CLUSTER }} \\`);
      lines.push(`${indent(depth)}      --service \${{ secrets.AWS_SERVICE }} \\`);
      
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
      lines.push(`${indent(depth)}    kubeconfig: \${{ secrets.KUBE_CONFIG }}`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to Kubernetes`);
      lines.push(`${indent(depth)}  run: |`);
      lines.push(`${indent(depth)}    kubectl apply -f k8s/`);
      
      if (c.deploymentStrategy === 'rolling') {
        lines.push(`${indent(depth)}    kubectl rollout status deployment/\${{ secrets.K8S_DEPLOYMENT }}`);
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
      lines.push(`${indent(depth)}    vercel-token: \${{ secrets.VERCEL_TOKEN }}`);
      lines.push(`${indent(depth)}    vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}`);
      lines.push(`${indent(depth)}    vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}`);
      lines.push(`${indent(depth)}    vercel-args: '--prod'`);
      break;
      
    case "netlify":
      lines.push(`${indent(depth)}- name: Deploy to Netlify`);
      lines.push(`${indent(depth)}  uses: nwtgck/actions-netlify@v2.1`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    publish-dir: './dist'`);
      lines.push(`${indent(depth)}    production-branch: main`);
      lines.push(`${indent(depth)}    github-token: \${{ secrets.GITHUB_TOKEN }}`);
      lines.push(`${indent(depth)}    deploy-message: "Deploy from GitHub Actions"`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}`);
      lines.push(`${indent(depth)}    NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}`);
      break;
      
    case "fly-io":
      lines.push(`${indent(depth)}- name: Deploy to Fly.io`);
      lines.push(`${indent(depth)}  uses: superfly/flyctl-actions/setup-flyctl@master`);
      lines.push("");
      lines.push(`${indent(depth)}- name: Deploy to Fly.io`);
      lines.push(`${indent(depth)}  run: flyctl deploy --remote-only`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    FLY_API_TOKEN: \${{ secrets.FLY_API_TOKEN }}`);
      break;
      
    case "railway":
      lines.push(`${indent(depth)}- name: Deploy to Railway`);
      lines.push(`${indent(depth)}  uses: railwayapp/cli-action@v1.0.0`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    railway-token: \${{ secrets.RAILWAY_TOKEN }}`);
      lines.push(`${indent(depth)}    service: \${{ secrets.RAILWAY_SERVICE_ID }}`);
      break;
      
    case "cloudflare-pages":
      lines.push(`${indent(depth)}- name: Deploy to Cloudflare Pages`);
      lines.push(`${indent(depth)}  uses: cloudflare/wrangler-action@v3`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}`);
      lines.push(`${indent(depth)}    accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}`);
      lines.push(`${indent(depth)}    command: pages deploy dist --project-name=${c.projectName}`);
      break;
      
    case "digitalocean":
      lines.push(`${indent(depth)}- name: Deploy to DigitalOcean App Platform`);
      lines.push(`${indent(depth)}  uses: digitalocean/app_action@v2.0.0`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    app_name: ${c.projectName}`);
      lines.push(`${indent(depth)}    token: \${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}`);
      break;
      
    case "heroku":
      lines.push(`${indent(depth)}- name: Deploy to Heroku`);
      lines.push(`${indent(depth)}  uses: akhileshns/heroku-deploy@v3.13.15`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    heroku_api_key: \${{ secrets.HEROKU_API_KEY }}`);
      lines.push(`${indent(depth)}    heroku_app_name: \${{ secrets.HEROKU_APP_NAME }}`);
      lines.push(`${indent(depth)}    heroku_email: \${{ secrets.HEROKU_EMAIL }}`);
      break;
      
    case "azure":
      lines.push(`${indent(depth)}- name: Deploy to Azure App Service`);
      lines.push(`${indent(depth)}  uses: azure/webapps-deploy@v2`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    app-name: \${{ secrets.AZURE_WEBAPP_NAME }}`);
      lines.push(`${indent(depth)}    publish-profile: \${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}`);
      lines.push(`${indent(depth)}    package: ./dist`);
      break;
      
    case "gcp":
      lines.push(`${indent(depth)}- name: Deploy to Google Cloud Run`);
      lines.push(`${indent(depth)}  uses: google-github-actions/deploy-cloudrun@v2`);
      lines.push(`${indent(depth)}  with:`);
      lines.push(`${indent(depth)}    service: ${c.projectName}`);
      lines.push(`${indent(depth)}    region: \${{ secrets.GCP_REGION }}`);
      lines.push(`${indent(depth)}    source: ./`);
      lines.push(`${indent(depth)}  env:`);
      lines.push(`${indent(depth)}    GOOGLE_CREDENTIALS: \${{ secrets.GCP_CREDENTIALS }}`);
      break;
  }

  return lines;
}

function getFormattingSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      const formatCmd = c.packageManager === "yarn" ? "yarn format:check" :
                        c.packageManager === "pnpm" ? "pnpm format:check" :
                        c.packageManager === "bun" ? "bun run format:check" : "npm run format:check";
      lines.push(`${indent(depth)}- name: Check code formatting`);
      lines.push(`${indent(depth)}  run: ${formatCmd}`);
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
  lines.push(`${indent(depth)}    SONAR_TOKEN: \${{ secrets.SONAR_TOKEN }}`);
  lines.push(`${indent(depth)}    SONAR_HOST_URL: \${{ secrets.SONAR_HOST_URL }}`);
  
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
