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
  lines.push("");
  lines.push("jobs:");

  lines.push(`${indent(1)}build:`);
  lines.push(`${indent(2)}runs-on: ubuntu-latest`);
  lines.push("");

  if (c.projectType === "nodejs" && c.nodeVersion) {
    lines.push(`${indent(2)}strategy:`);
    lines.push(`${indent(3)}matrix:`);
    lines.push(`${indent(4)}node-version: [${c.nodeVersion}]`);
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

  if (c.enableSecurityScan) {
    lines.push("");
    lines.push(...getSecuritySteps(c, 3));
  }

  if (c.enableTests) {
    lines.push("");
    lines.push(...getTestSteps(c, 3));
  }

  if (c.enableBuild) {
    lines.push("");
    lines.push(...getBuildSteps(c, 3));
  }

  if (c.enableDocker) {
    lines.push("");
    lines.push(...getDockerJob(c));
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
