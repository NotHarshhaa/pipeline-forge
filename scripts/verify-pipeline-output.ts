/**
 * Smoke test: advanced Pipeline Studio options → generated YAML.
 * Run: npm run verify:pipeline
 */
import {
  generatePipeline,
  validateYAML,
  validatePipelineConfig,
  type PipelineConfig,
} from "../src/lib/generate-pipeline";

const base: PipelineConfig = {
  projectName: "pipeline-forge-demo",
  projectType: "nodejs",
  ciProvider: "github-actions",
  nodeVersion: "20",
  packageManager: "npm",
  enableDocker: false,
  enableTests: true,
  enableLinting: true,
  enableBuild: true,
  deployTarget: "none",
  branches: ["main", "develop"],
  enableCaching: true,
  enableSecurityScan: false,
  enableE2ETesting: false,
  enableCodeFormatting: false,
  enableTypeChecking: false,
  enableDependencyAudit: false,
  enableContainerScan: false,
  enableSonarQube: false,
  ciSettings: {
    concurrency: 1,
    timeout: 30,
    retryOnFailure: false,
    parallelJobs: true,
  },
  environmentVariables: [{ key: "NODE_ENV", value: "test" }],
  matrixBuild: { enabled: true, versions: ["18", "20"] },
  artifacts: { enabled: true, paths: ["dist", ".next"], retention: 7 },
};

const scenarios: { name: string; config: PipelineConfig }[] = [
  {
    name: "pnpm + matrix + env + artifacts",
    config: { ...base, packageManager: "pnpm" },
  },
  {
    name: "yarn + matrix + env + artifacts",
    config: { ...base, packageManager: "yarn" },
  },
];

let failed = 0;

for (const { name, config } of scenarios) {
  const yaml = generatePipeline(config);
  const configIssues = validatePipelineConfig(config);
  const result = validateYAML(yaml, config.ciProvider);
  const errors = [
    ...configIssues.filter((e) => e.severity === "error"),
    ...result.errors,
  ];
  const warnings = [
    ...configIssues.filter((e) => e.severity === "warning"),
    ...result.warnings,
  ];

  const checks = [
    ["quoted branches", yaml.includes('"main"') && yaml.includes('"develop"')],
    ["matrix versions", yaml.includes("node-version: [\"18\", \"20\"]")],
    ["env NODE_ENV", yaml.includes("NODE_ENV:")],
    ["pnpm setup", config.packageManager === "pnpm" ? yaml.includes("pnpm/action-setup") : true],
    ["yarn install", config.packageManager === "yarn" ? yaml.includes("yarn install") : true],
    ["upload artifact", yaml.includes("actions/upload-artifact@v4")],
    ["workflow concurrency", yaml.includes("concurrency:") && !/^\s+concurrency:/m.test(yaml.split("jobs:")[1] ?? "")],
  ] as const;

  const failedChecks = checks.filter(([, ok]) => !ok).map(([label]) => label);

  console.log(`\n=== ${name} ===`);
  console.log(yaml.split("\n").slice(0, 28).join("\n"));
  console.log("...");
  console.log(
    `validation: ${errors.length === 0 ? "OK" : "ERRORS"} (${errors.length} errors, ${warnings.length} warnings)`
  );
  if (failedChecks.length) {
    console.log("FAILED checks:", failedChecks.join(", "));
    failed++;
  } else {
    console.log("All content checks passed.");
  }
  if (errors.length) {
    console.log("Errors:", errors.map((e) => e.message).join("; "));
    failed++;
  }
}

process.exit(failed > 0 ? 1 : 0);
