// @ts-nocheck - This file generates Jenkins pipeline syntax
import { PipelineConfig } from "../types";

export function generateJenkins(c: PipelineConfig): string {
  const lines: string[] = [];
  const indent = (n: number) => "  ".repeat(n);

  lines.push("pipeline {");
  lines.push(`${indent(1)}agent any`);
  lines.push("");

  // Add timeout
  if (c.ciSettings?.timeout) {
    lines.push(`${indent(1)}options {`);
    lines.push(`${indent(2)}timeout(time: ${c.ciSettings.timeout}, unit: 'MINUTES')`);
    if (c.ciSettings?.retryOnFailure) {
      lines.push(`${indent(2)}retry(2)`);
    }
    lines.push(`${indent(1)}}`);
    lines.push("");
  }

  lines.push(`${indent(1)}triggers {`);
  lines.push(`${indent(2)}pollSCM('H/5 * * * *')`);
  if (c.schedule?.enabled && c.schedule.cron) {
    lines.push(`${indent(2)}cron('${c.schedule.cron}')`);
  }
  lines.push(`${indent(1)}}`);
  lines.push("");

  if (c.projectType === "nodejs" || c.projectType === "python" || c.projectType === "java") {
    lines.push(`${indent(1)}tools {`);
    if (c.projectType === "nodejs") {
      lines.push(`${indent(2)}nodejs 'NodeJS ${c.nodeVersion || "20"}'`);
    } else if (c.projectType === "java") {
      lines.push(`${indent(2)}maven 'Maven 3.9'`);
      lines.push(`${indent(2)}jdk 'JDK ${c.javaVersion || "17"}'`);
    }
    lines.push(`${indent(1)}}`);
    lines.push("");
  }

  lines.push(`${indent(1)}environment {`);
  lines.push(`${indent(2)}PROJECT_NAME = '${c.projectName}'`);
  if (c.packageManager) {
    lines.push(`${indent(2)}PACKAGE_MANAGER = '${c.packageManager}'`);
  }
  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`${indent(2)}WORKING_DIR = '${c.workingDirectory}'`);
  }
  if (c.isMonorepo && c.monorepoTool) {
    lines.push(`${indent(2)}MONOREPO_TOOL = '${c.monorepoTool}'`);
  }
  if (c.enableDocker) {
    lines.push(`${indent(2)}DOCKER_IMAGE = '${c.dockerImageName || c.projectName}'`);
    lines.push(`${indent(2)}DOCKER_CREDENTIALS = credentials('docker-hub-credentials')`);
  }
  if (c.deployTarget === "aws") {
    lines.push(`${indent(2)}AWS_CREDENTIALS = credentials('aws-credentials')`);
  } else if (c.deployTarget === "kubernetes") {
    lines.push(`${indent(2)}KUBECONFIG = credentials('kubeconfig')`);
  }
  lines.push(`${indent(1)}}`);
  lines.push("");

  lines.push(`${indent(1)}stages {`);

  lines.push(`${indent(2)}stage('Checkout') {`);
  lines.push(`${indent(3)}steps {`);
  lines.push(`${indent(4)}checkout scm`);
  lines.push(`${indent(3)}}`);
  lines.push(`${indent(2)}}`);
  lines.push("");

  lines.push(`${indent(2)}stage('Install Dependencies') {`);
  lines.push(`${indent(3)}steps {`);
  lines.push(...getJenkinsInstallSteps(c, 4));
  lines.push(`${indent(3)}}`);
  lines.push(`${indent(2)}}`);
  lines.push("");

  if (c.enableLinting) {
    lines.push(`${indent(2)}stage('Lint') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsLintSteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableCodeFormatting) {
    lines.push(`${indent(2)}stage('Format Check') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsFormatSteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableTypeChecking) {
    lines.push(`${indent(2)}stage('Type Check') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsTypeCheckSteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableSecurityScan) {
    lines.push(`${indent(2)}stage('Security Scan') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsSecuritySteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableTests) {
    lines.push(`${indent(2)}stage('Test') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsTestSteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableE2ETesting) {
    lines.push(`${indent(2)}stage('E2E Tests') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsE2ESteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableDependencyAudit) {
    lines.push(`${indent(2)}stage('Dependency Audit') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsAuditSteps(c, 4));
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableContainerScan) {
    lines.push(`${indent(2)}stage('Container Scan') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(`${indent(4)}sh 'trivy image --exit-code 0 --severity HIGH,CRITICAL ${c.dockerImageName || c.projectName}:latest'`);
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableSonarQube) {
    lines.push(`${indent(2)}stage('SonarQube Analysis') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(`${indent(4)}withSonarQubeEnv('SonarQube') {`);
    lines.push(`${indent(5)}sh 'sonar-scanner'`);
    lines.push(`${indent(4)}}`);  
    lines.push(`${indent(3)}}`);  
    lines.push(`${indent(2)}}`);  
    lines.push("");
  }

  if (c.enableBuild) {
    lines.push(`${indent(2)}stage('Build') {`);
    lines.push(`${indent(3)}steps {`);
    lines.push(...getJenkinsBuildSteps(c, 4));
    lines.push(`${indent(3)}}`);
    lines.push(`${indent(2)}}`);
    lines.push("");
  }

  if (c.enableDocker) {
    lines.push(`${indent(2)}stage('Docker Build & Push') {`);
    lines.push(`${indent(3)}when {`);
    lines.push(`${indent(4)}branch '${c.branches[0] || "main"}'`);
    lines.push(`${indent(3)}}`);
    lines.push(`${indent(3)}steps {`);
    lines.push(`${indent(4)}script {`);
    lines.push(`${indent(5)}docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {`);
    lines.push(`${indent(6)}def image = docker.build("\${DOCKER_IMAGE}:\${BUILD_NUMBER}")`);
    lines.push(`${indent(6)}image.push()`);
    lines.push(`${indent(6)}image.push('latest')`);
    lines.push(`${indent(5)}}`);
    lines.push(`${indent(4)}}`);
    lines.push(`${indent(3)}}`);
    lines.push(`${indent(2)}}`);
    lines.push("");
  }

  if (c.deployTarget !== "none") {
    lines.push(`${indent(2)}stage('Deploy') {`);
    lines.push(`${indent(3)}when {`);
    lines.push(`${indent(4)}branch '${c.branches[0] || "main"}'`);
    lines.push(`${indent(3)}}`);
    lines.push(`${indent(3)}steps {`);
    if (c.deployTarget === "aws") {
      lines.push(`${indent(4)}withCredentials([usernamePassword(credentialsId: 'aws-credentials', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {`);
      lines.push(`${indent(5)}sh '''`);
      lines.push(`${indent(6)}aws ecs update-service --cluster \${AWS_CLUSTER} --service \${AWS_SERVICE} --force-new-deployment`);
      lines.push(`${indent(5)}'''`);
      lines.push(`${indent(4)}}`);
    } else if (c.deployTarget === "kubernetes") {
      lines.push(`${indent(4)}sh '''`);
      lines.push(`${indent(5)}kubectl apply -f k8s/`);
      lines.push(`${indent(5)}kubectl rollout status deployment/\${K8S_DEPLOYMENT}`);
      lines.push(`${indent(4)}'''`);
    }
    lines.push(`${indent(3)}}`);
    lines.push(`${indent(2)}}`);
  }

  lines.push(`${indent(1)}}`);
  lines.push("");

  lines.push(`${indent(1)}post {`);
  lines.push(`${indent(2)}success {`);
  lines.push(`${indent(3)}echo 'Pipeline succeeded!'`);
  lines.push(`${indent(2)}}`);
  lines.push(`${indent(2)}failure {`);
  lines.push(`${indent(3)}echo 'Pipeline failed!'`);
  lines.push(`${indent(2)}}`);
  lines.push(`${indent(1)}}`);
  lines.push("}");

  return lines.join("\n");
}

function getJenkinsInstallSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`${indent(depth)}dir('${c.workingDirectory}') {`);
  }

  switch (c.projectType) {
    case "nodejs":
      const installCmd = c.packageManager === "yarn" ? "yarn install --frozen-lockfile" :
                        c.packageManager === "pnpm" ? "pnpm install --frozen-lockfile" :
                        c.packageManager === "bun" ? "bun install" : "npm ci";
      lines.push(`${indent(depth)}sh '${installCmd}'`);
      if (c.isMonorepo && c.monorepoTool) {
        lines.push(`${indent(depth)}sh 'npx ${c.monorepoTool}@latest install'`);
      }
      break;
    case "python":
      if (c.packageManager === "poetry") {
        lines.push(`${indent(depth)}sh 'pip install poetry && poetry install'`);
      } else {
        lines.push(`${indent(depth)}sh '''`);
        lines.push(`${indent(depth + 1)}python -m pip install --upgrade pip`);
        lines.push(`${indent(depth + 1)}pip install -r requirements.txt`);
        lines.push(`${indent(depth)}'''`);
      }
      break;
    case "java":
      if (c.packageManager === "gradle") {
        lines.push(`${indent(depth)}sh './gradlew dependencies'`);
      } else {
        lines.push(`${indent(depth)}sh 'mvn dependency:resolve'`);
      }
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go mod download'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo fetch'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet restore'`);
      break;
  }

  if (c.workingDirectory && c.workingDirectory !== ".") {
    lines.push(`${indent(depth)}}`);
  }

  return lines;
}

function getJenkinsLintSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npm run lint'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install flake8 && flake8 .'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn checkstyle:check'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'golangci-lint run'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo clippy -- -D warnings'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet format --verify-no-changes'`);
      break;
  }
  return lines;
}

function getJenkinsSecuritySteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npm audit --audit-level=high'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install safety && safety check'`);
      break;
    default:
      lines.push(`${indent(depth)}echo 'Security scan placeholder'`);
      break;
  }
  return lines;
}

function getJenkinsTestSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npm test'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install pytest && pytest'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn test'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go test ./...'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo test'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet test'`);
      break;
  }
  return lines;
}

function getJenkinsBuildSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npm run build'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'python setup.py sdist bdist_wheel'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn package -DskipTests'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go build ./...'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo build --release'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet build --configuration Release'`);
      break;
  }
  return lines;
}

function getJenkinsFormatSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      const formatCmd = c.packageManager === "yarn" ? "yarn format:check" :
                        c.packageManager === "pnpm" ? "pnpm format:check" :
                        c.packageManager === "bun" ? "bun run format:check" : "npm run format:check";
      lines.push(`${indent(depth)}sh '${formatCmd}'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install black && black --check .'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn spotless:check'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'gofmt -l .'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo fmt -- --check'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet format --verify-no-changes'`);
      break;
  }
  return lines;
}

function getJenkinsTypeCheckSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npx tsc --noEmit'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install mypy && mypy .'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn compiler:compile'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go build ./...'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo check'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet build --no-restore'`);
      break;
  }
  return lines;
}

function getJenkinsE2ESteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      lines.push(`${indent(depth)}sh 'npm run test:e2e'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install pytest-playwright && pytest --playwright'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn verify -DskipITs=false'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go test -tags=e2e ./...'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo test --test \"*\"'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet test --filter \"FullyQualifiedName~E2E\"'`);
      break;
  }
  return lines;
}

function getJenkinsAuditSteps(c: PipelineConfig, depth: number): string[] {
  const indent = (n: number) => "  ".repeat(n);
  const lines: string[] = [];

  switch (c.projectType) {
    case "nodejs":
      const auditCmd = c.packageManager === "yarn" ? "yarn audit" :
                        c.packageManager === "pnpm" ? "pnpm audit" :
                        c.packageManager === "bun" ? "bun audit" : "npm audit --audit-level=high";
      lines.push(`${indent(depth)}sh '${auditCmd}'`);
      break;
    case "python":
      lines.push(`${indent(depth)}sh 'pip install pip-audit && pip-audit'`);
      break;
    case "java":
      lines.push(`${indent(depth)}sh 'mvn org.owasp:dependency-check-maven:check'`);
      break;
    case "go":
      lines.push(`${indent(depth)}sh 'go install golang.org/x/vuln/cmd/govulncheck@latest && govulncheck ./...'`);
      break;
    case "rust":
      lines.push(`${indent(depth)}sh 'cargo audit'`);
      break;
    case "dotnet":
      lines.push(`${indent(depth)}sh 'dotnet list package --vulnerable'`);
      break;
  }
  return lines;
}
