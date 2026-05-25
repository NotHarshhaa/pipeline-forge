import type { PipelineConfig } from "../types";

export function indent(level: number): string {
  return "  ".repeat(level);
}

/** GitHub Actions expression: ${{ ... }} */
export function ghaExpr(expression: string): string {
  return "${{ " + expression + " }}";
}

export function formatYamlStringList(items: string[]): string {
  return items.map((item) => `"${item.replace(/"/g, '\\"')}"`).join(", ");
}

export function formatYamlBranches(branches: string[]): string {
  const list = branches.length > 0 ? branches : ["main"];
  return `[${formatYamlStringList(list)}]`;
}

export function getPrimaryBranch(config: PipelineConfig): string {
  return config.branches[0] ?? "main";
}

export function shouldSkipDependencyCache(config: PipelineConfig): boolean {
  return (
    config.optimization?.enabled === true &&
    config.optimization.cacheDependencies === false
  );
}

export function getNodeLockfile(config: PipelineConfig): string {
  switch (config.packageManager) {
    case "yarn":
      return "yarn.lock";
    case "pnpm":
      return "pnpm-lock.yaml";
    case "bun":
      return "bun.lockb";
    default:
      return "package-lock.json";
  }
}

export function getNodeInstallCommand(config: PipelineConfig): string {
  switch (config.packageManager) {
    case "yarn":
      return "yarn install --frozen-lockfile";
    case "pnpm":
      return "pnpm install --frozen-lockfile";
    case "bun":
      return "bun install --frozen-lockfile";
    default:
      return "npm ci";
  }
}

export function getNodeRunPrefix(config: PipelineConfig): string {
  switch (config.packageManager) {
    case "yarn":
      return "yarn";
    case "pnpm":
      return "pnpm";
    case "bun":
      return "bun run";
    default:
      return "npm run";
  }
}

export function getNodeCachePath(config: PipelineConfig): string {
  switch (config.packageManager) {
    case "pnpm":
      return "~/.pnpm-store";
    case "yarn":
      return "~/.yarn/cache";
    default:
      return "~/.npm";
  }
}

export function getMonorepoCachePath(
  tool: PipelineConfig["monorepoTool"]
): string | null {
  switch (tool) {
    case "nx":
      return ".nx/cache";
    case "turborepo":
      return ".turbo";
    case "lerna":
      return "node_modules/.cache/lerna";
    case "rush":
      return "common/temp";
    default:
      return null;
  }
}

export function getGitLabCachePaths(config: PipelineConfig): string[] {
  switch (config.projectType) {
    case "nodejs": {
      const cachePath =
        config.packageManager === "pnpm"
          ? ".pnpm-store"
          : config.packageManager === "yarn"
            ? ".yarn/cache"
            : "node_modules";
      const paths = [`    - ${cachePath}/`];
      const monoPath = config.isMonorepo
        ? getMonorepoCachePath(config.monorepoTool)
        : null;
      if (monoPath) paths.push(`    - ${monoPath}/`);
      return paths;
    }
    case "python":
      return ["    - .cache/pip/"];
    case "java":
      return ["    - .m2/repository/"];
    case "go":
      return ["    - /go/pkg/mod/"];
    default:
      return [];
  }
}

export function sanitizeJobId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
}
