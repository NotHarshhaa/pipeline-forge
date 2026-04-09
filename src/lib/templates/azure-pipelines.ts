// @ts-nocheck - This file generates Azure Pipelines YAML syntax
import { PipelineConfig } from "../types";

export function generateAzurePipelines(c: PipelineConfig): string {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);

  lines.push(`# ${c.projectName} Azure Pipeline`);
  lines.push("");
  lines.push("trigger:");
  for (const branch of c.branches) {
    lines.push(`  - ${branch}`);
  }
  lines.push("");

  lines.push("pool:");
  lines.push("  vmImage: 'ubuntu-latest'");
  lines.push("");

  lines.push("variables:");
  lines.push(`  projectName: '${c.projectName}'`);
  if (c.packageManager) {
    lines.push(`  packageManager: '${c.packageManager}'`);
  }
  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`  workingDirectory: '${c.workingDirectory}'`);
  }
  if (c.isMonorepo && c.monorepoTool) {
    lines.push(`  monorepoTool: '${c.monorepoTool}'`);
  }
  if (c.enableDocker) {
    lines.push(`  dockerImageName: '${c.dockerImageName || c.projectName}'`);
  }
  lines.push("");

  lines.push("stages:");
  
  lines.push("  - stage: Build");
  lines.push("    displayName: 'Build and Test'");
  lines.push("    jobs:");
  lines.push("      - job: BuildJob");
  lines.push("        displayName: 'Build Job'");
  lines.push("        steps:");
  
  lines.push(...getAzureSetupSteps(c, 10));
  lines.push("");

  if (c.enableCaching) {
    lines.push(...getAzureCacheSteps(c, 10));
    lines.push("");
  }

  lines.push(...getAzureInstallSteps(c, 10));
  lines.push("");

  if (c.enableLinting) {
    lines.push(...getAzureLintSteps(c, 10));
    lines.push("");
  }

  if (c.enableCodeFormatting) {
    lines.push(...getAzureFormatSteps(c, 10));
    lines.push("");
  }

  if (c.enableTypeChecking) {
    lines.push(...getAzureTypeCheckSteps(c, 10));
    lines.push("");
  }

  if (c.enableSecurityScan) {
    lines.push(...getAzureSecuritySteps(c, 10));
    lines.push("");
  }

  if (c.enableTests) {
    lines.push(...getAzureTestSteps(c, 10));
    lines.push("");
  }

  if (c.enableE2ETesting) {
    lines.push(...getAzureE2ESteps(c, 10));
    lines.push("");
  }

  if (c.enableDependencyAudit) {
    lines.push(...getAzureAuditSteps(c, 10));
    lines.push("");
  }

  if (c.enableBuild) {
    lines.push(...getAzureBuildSteps(c, 10));
  }

  if (c.enableDocker) {
    lines.push("");
    lines.push("  - stage: Docker");
    lines.push("    displayName: 'Docker Build and Push'");
    lines.push("    dependsOn: Build");
    lines.push("    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))");
    lines.push("    jobs:");
    lines.push("      - job: DockerJob");
    lines.push("        displayName: 'Docker Job'");
    lines.push("        steps:");
    lines.push("          - task: Docker@2");
    lines.push("            displayName: 'Build and Push Docker Image'");
    lines.push("            inputs:");
    lines.push("              containerRegistry: 'DockerHub'");
    lines.push("              repository: '$(dockerImageName)'");
    lines.push("              command: 'buildAndPush'");
    lines.push("              Dockerfile: '$(Build.SourcesDirectory)/Dockerfile'");
    lines.push("              tags: |");
    lines.push("                $(Build.BuildId)");
    lines.push("                latest");
  }

  if (c.deployTarget !== "none") {
    lines.push("");
    const dependsOn = c.enableDocker ? "Docker" : "Build";
    lines.push("  - stage: Deploy");
    lines.push("    displayName: 'Deploy to Production'");
    lines.push(`    dependsOn: ${dependsOn}`);
    lines.push("    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))");
    lines.push("    jobs:");
    lines.push("      - deployment: DeployJob");
    lines.push("        displayName: 'Deploy Job'");
    lines.push("        environment: 'production'");
    lines.push("        strategy:");
    lines.push("          runOnce:");
    lines.push("            deploy:");
    lines.push("              steps:");
    
    if (c.deployTarget === "aws") {
      lines.push("                - task: AWSShellScript@1");
      lines.push("                  displayName: 'Deploy to AWS ECS'");
      lines.push("                  inputs:");
      lines.push("                    awsCredentials: 'AWS-Connection'");
      lines.push("                    regionName: '$(AWS_REGION)'");
      lines.push("                    scriptType: 'inline'");
      lines.push("                    inlineScript: |");
      lines.push("                      aws ecs update-service \\");
      lines.push("                        --cluster $(AWS_CLUSTER) \\");
      lines.push("                        --service $(AWS_SERVICE) \\");
      lines.push("                        --force-new-deployment");
    } else if (c.deployTarget === "kubernetes") {
      lines.push("                - task: Kubernetes@1");
      lines.push("                  displayName: 'Deploy to Kubernetes'");
      lines.push("                  inputs:");
      lines.push("                    connectionType: 'Kubernetes Service Connection'");
      lines.push("                    kubernetesServiceEndpoint: 'K8s-Connection'");
      lines.push("                    command: 'apply'");
      lines.push("                    arguments: '-f k8s/'");
      lines.push("                - task: Kubernetes@1");
      lines.push("                  displayName: 'Check Rollout Status'");
      lines.push("                  inputs:");
      lines.push("                    connectionType: 'Kubernetes Service Connection'");
      lines.push("                    kubernetesServiceEndpoint: 'K8s-Connection'");
      lines.push("                    command: 'rollout'");
      lines.push("                    arguments: 'status deployment/$(K8S_DEPLOYMENT)'");
    }
  }

  return lines.join("\n");
}

function getAzureSetupSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- task: NodeTool@0`);
      lines.push(`${indent(depth)}  displayName: 'Setup Node.js'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    versionSpec: '${c.nodeVersion || "20"}'`);
      break;
    case "python":
      lines.push(`${indent(depth)}- task: UsePythonVersion@0`);
      lines.push(`${indent(depth)}  displayName: 'Setup Python'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    versionSpec: '${c.pythonVersion || "3.12"}'`);
      break;
    case "java":
      lines.push(`${indent(depth)}- task: JavaToolInstaller@0`);
      lines.push(`${indent(depth)}  displayName: 'Setup Java'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    versionSpec: '${c.javaVersion || "17"}'`);
      lines.push(`${indent(depth)}    jdkArchitectureOption: 'x64'`);
      lines.push(`${indent(depth)}    jdkSourceOption: 'PreInstalled'`);
      break;
    case "go":
      lines.push(`${indent(depth)}- task: GoTool@0`);
      lines.push(`${indent(depth)}  displayName: 'Setup Go'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    version: '${c.goVersion || "1.22"}'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}- task: UseDotNet@2`);
      lines.push(`${indent(depth)}  displayName: 'Setup .NET'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    version: '8.0.x'`);
      break;
  }

  return lines;
}

function getAzureCacheSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}- task: Cache@2`);
      lines.push(`${indent(depth)}  displayName: 'Cache npm packages'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    key: 'npm | "$(Agent.OS)" | package-lock.json'`);
      lines.push(`${indent(depth)}    path: '$(npm_config_cache)'`);
      break;
    case "python":
      lines.push(`${indent(depth)}- task: Cache@2`);
      lines.push(`${indent(depth)}  displayName: 'Cache pip packages'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    key: 'pip | "$(Agent.OS)" | requirements.txt'`);
      lines.push(`${indent(depth)}    path: '$(PIP_CACHE_DIR)'`);
      break;
    case "java":
      lines.push(`${indent(depth)}- task: Cache@2`);
      lines.push(`${indent(depth)}  displayName: 'Cache Maven packages'`);
      lines.push(`${indent(depth)}  inputs:`);
      lines.push(`${indent(depth)}    key: 'maven | "$(Agent.OS)" | pom.xml'`);
      lines.push(`${indent(depth)}    path: '$(MAVEN_CACHE_FOLDER)'`);
      break;
  }

  return lines;
}

function getAzureInstallSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm ci`);
      break;
    case "python":
      lines.push(`${indent(depth)}    python -m pip install --upgrade pip`);
      lines.push(`${indent(depth)}    pip install -r requirements.txt`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn dependency:resolve`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go mod download`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo fetch`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet restore`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Install dependencies'`);
  return lines;
}

function getAzureLintSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm run lint`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install flake8`);
      lines.push(`${indent(depth)}    flake8 .`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn checkstyle:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}    golangci-lint run`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo clippy -- -D warnings`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet format --verify-no-changes`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Run linter'`);
  return lines;
}

function getAzureSecuritySteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm audit --audit-level=high`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install safety`);
      lines.push(`${indent(depth)}    safety check`);
      break;
    default:
      lines.push(`${indent(depth)}    echo "Security scan placeholder"`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Security scan'`);
  return lines;
}

function getAzureTestSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm test`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install pytest`);
      lines.push(`${indent(depth)}    pytest`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn test`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go test ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo test`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet test`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Run tests'`);
  return lines;
}

function getAzureBuildSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm run build`);
      break;
    case "python":
      lines.push(`${indent(depth)}    python setup.py sdist bdist_wheel`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn package -DskipTests`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go build ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo build --release`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet build --configuration Release`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Build'`);
  return lines;
}

function getAzureFormatSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm run format:check`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install black`);
      lines.push(`${indent(depth)}    black --check .`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn spotless:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}    gofmt -l .`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo fmt -- --check`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet format --verify-no-changes`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Check formatting'`);
  return lines;
}

function getAzureTypeCheckSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npx tsc --noEmit`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install mypy`);
      lines.push(`${indent(depth)}    mypy .`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn compiler:compile`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go build ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo check`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet build --no-restore`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Type check'`);
  return lines;
}

function getAzureE2ESteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

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

  lines.push(`${indent(depth)}  displayName: 'Run E2E tests'`);
  return lines;
}

function getAzureAuditSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  lines.push(`${indent(depth)}- script: |`);

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}    npm audit --audit-level=high`);
      break;
    case "python":
      lines.push(`${indent(depth)}    pip install pip-audit`);
      lines.push(`${indent(depth)}    pip-audit`);
      break;
    case "java":
      lines.push(`${indent(depth)}    mvn org.owasp:dependency-check-maven:check`);
      break;
    case "go":
      lines.push(`${indent(depth)}    go install golang.org/x/vuln/cmd/govulncheck@latest`);
      lines.push(`${indent(depth)}    govulncheck ./...`);
      break;
    case "rust":
      lines.push(`${indent(depth)}    cargo audit`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}    dotnet list package --vulnerable`);
      break;
  }

  lines.push(`${indent(depth)}  displayName: 'Dependency audit'`);
  return lines;
}
