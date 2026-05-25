import {
  IconBolt,
  IconSettings,
  IconRocket,
  IconDownload,
  IconCode,
  IconTerminal,
  IconCloud,
  IconDeviceFloppy,
  IconRefresh,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

export type InstructionStep = {
  id: string;
  icon: Icon;
  title: string;
  description: string;
  tips: string[];
};

export const instructionHighlights = [
  {
    icon: IconBolt,
    title: "Instant generation",
    desc: "YAML in seconds, not hours",
  },
  {
    icon: IconSettings,
    title: "Best practices",
    desc: "Security and quality built in",
  },
  {
    icon: IconRefresh,
    title: "5 CI providers",
    desc: "GitHub, GitLab, Jenkins & more",
  },
  {
    icon: IconCode,
    title: "Clean output",
    desc: "Production-ready formatting",
  },
  {
    icon: IconDeviceFloppy,
    title: "Save & export",
    desc: "Local storage + JSON export",
  },
  {
    icon: IconTerminal,
    title: "Fully customizable",
    desc: "Every pipeline knob exposed",
  },
];

export const instructionSteps: InstructionStep[] = [
  {
    id: "presets",
    icon: IconBolt,
    title: "Choose a quick preset",
    description:
      "Start from a template: Basic Node.js, Production Node.js, Python API, Docker/K8s, or Full Featured. Each preset applies sensible defaults you can tweak.",
    tips: [
      "Basic Node.js — simple apps with tests and lint",
      "Production Node.js — security scans + deployment",
      "Docker/K8s — container builds and orchestration",
    ],
  },
  {
    id: "project",
    icon: IconSettings,
    title: "Configure project details",
    description:
      "Set the project name, stack (Node.js, Python, Java, Go, Rust, .NET), package manager, working directory, and monorepo tool when applicable.",
    tips: [
      "Project name is used in generated file paths",
      "Package manager drives install commands",
      "Supports Nx, Turborepo, Lerna, and Rush",
    ],
  },
  {
    id: "provider",
    icon: IconCode,
    title: "Select your CI provider",
    description:
      "Pick GitHub Actions, GitLab CI, Jenkins, CircleCI, or Azure Pipelines. Tune concurrency, job timeout, retries, and parallel execution.",
    tips: [
      "GitHub Actions for repos on GitHub",
      "GitLab CI for native GitLab integration",
      "Jenkins when you need self-hosted control",
    ],
  },
  {
    id: "pipeline",
    icon: IconTerminal,
    title: "Configure pipeline steps",
    description:
      "Enable linting, unit tests, E2E tests, formatting, type checks, builds, security scans, dependency audits, Docker builds, and container scanning.",
    tips: [
      "Always run tests before deploy targets",
      "Security + audit steps catch CVEs early",
      "Docker when you ship containers",
    ],
  },
  {
    id: "deploy",
    icon: IconCloud,
    title: "Choose deployment target",
    description:
      "Deploy to AWS, Kubernetes, Vercel, Netlify, Heroku, Azure, GCP, Fly.io, Railway, Cloudflare Pages, or DigitalOcean — or skip deployment.",
    tips: [
      "Vercel / Netlify for front-end apps",
      "Kubernetes for multi-service stacks",
      "AWS ECS for container workloads",
    ],
  },
  {
    id: "advanced",
    icon: IconRocket,
    title: "Advanced features (optional)",
    description:
      "Add env vars, custom scripts, Slack/email notifications, matrix builds, artifacts, cron schedules, quality gates, performance tests, and service containers.",
    tips: [
      "Matrix builds test Node 18 / 20 / 22 in parallel",
      "Notifications alert the team on failure",
      "Schedules for nightly or weekly runs",
    ],
  },
  {
    id: "save",
    icon: IconDeviceFloppy,
    title: "Save your configuration",
    description:
      "Name and store configs in browser local storage. Export JSON to share with teammates or version in git.",
    tips: [
      "Use names like prod-nodejs or staging-api",
      "Export JSON before big refactors",
      "Import JSON to restore a teammate's setup",
    ],
  },
  {
    id: "generate",
    icon: IconDownload,
    title: "Generate and export",
    description:
      "Click Generate Pipeline, review syntax-highlighted YAML in the live preview, then copy or download. File names match your provider automatically.",
    tips: [
      "Copy for quick paste into your repo",
      "Download commits as .github/workflows/ci.yml etc.",
      "Re-generate anytime after config changes",
    ],
  },
];
