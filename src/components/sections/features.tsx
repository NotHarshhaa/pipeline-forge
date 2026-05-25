"use client";

import { useState } from "react";
import {
  IconBolt,
  IconPuzzle,
  IconRefresh,
  IconBrandDocker,
  IconCloud,
  IconShieldLock,
  IconSettings,
  IconTerminal,
  IconBell,
  IconGitBranch,
  IconPackage,
  IconClock,
  IconChartBar,
  IconRocket,
  IconDatabase,
  IconCheck,
  IconDeviceFloppy,
  IconPalette,
  IconTemplate,
  IconUpload,
  IconArrowBackUp,
  IconBulb,
  IconCurrencyDollar,
  IconDeviceMobile,
  IconSparkles,
} from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Feature = {
  icon: Icon;
  title: string;
  description: string;
};

type FeatureCategory = {
  id: string;
  label: string;
  description: string;
  features: Feature[];
};

const featureCategories: FeatureCategory[] = [
  {
    id: "core",
    label: "Core",
    description: "Everything to go from zero to a working pipeline.",
    features: [
      {
        icon: IconBolt,
        title: "Instant generation",
        description: "Production YAML in seconds, not hours of copy-paste.",
      },
      {
        icon: IconPuzzle,
        title: "Multi-stack support",
        description: "Node.js, Python, Java, Go, Rust, and .NET.",
      },
      {
        icon: IconRefresh,
        title: "Multiple CI providers",
        description: "GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure.",
      },
      {
        icon: IconTemplate,
        title: "Quick presets",
        description: "Templates for Node, Python, Docker/K8s, and full enterprise setups.",
      },
      {
        icon: IconPalette,
        title: "Syntax highlighting",
        description: "Readable, color-coded YAML in the live preview.",
      },
      {
        icon: IconCheck,
        title: "YAML validation",
        description: "Catch syntax issues before you commit.",
      },
    ],
  },
  {
    id: "build",
    label: "Build & test",
    description: "Quality gates from lint to performance.",
    features: [
      {
        icon: IconBrandDocker,
        title: "Docker support",
        description: "Build and push images with configurable image names.",
      },
      {
        icon: IconShieldLock,
        title: "Security scanning",
        description: "Dependency audits and container scans built in.",
      },
      {
        icon: IconTerminal,
        title: "Custom scripts",
        description: "Pre-build, pre-test, and post-build hook commands.",
      },
      {
        icon: IconGitBranch,
        title: "Matrix builds",
        description: "Test across Node/Python versions in parallel.",
      },
      {
        icon: IconChartBar,
        title: "Code quality",
        description: "Coverage thresholds and quality gates.",
      },
      {
        icon: IconRocket,
        title: "Performance testing",
        description: "Load tests and benchmarks in your pipeline.",
      },
    ],
  },
  {
    id: "deploy",
    label: "Deploy",
    description: "Ship to the platform your team already uses.",
    features: [
      {
        icon: IconCloud,
        title: "Deployment targets",
        description: "AWS, Kubernetes, Vercel, Netlify, Fly.io, Railway, and more.",
      },
      {
        icon: IconSettings,
        title: "Deployment strategies",
        description: "Rolling, blue-green, canary, and recreate patterns.",
      },
      {
        icon: IconGitBranch,
        title: "Multi-environment",
        description: "Map dev, staging, and prod to branches.",
      },
      {
        icon: IconDatabase,
        title: "Services & databases",
        description: "PostgreSQL, MySQL, Redis, Elasticsearch sidecars.",
      },
      {
        icon: IconPackage,
        title: "Artifacts",
        description: "Upload build outputs with retention policies.",
      },
      {
        icon: IconClock,
        title: "Scheduled runs",
        description: "Cron-based pipelines with timezone support.",
      },
    ],
  },
  {
    id: "dx",
    label: "Developer UX",
    description: "Tools that make iteration painless.",
    features: [
      {
        icon: IconSettings,
        title: "Environment variables",
        description: "Key-value pairs injected into your workflow.",
      },
      {
        icon: IconBell,
        title: "Notifications",
        description: "Slack webhooks and email alerts on failure.",
      },
      {
        icon: IconDeviceFloppy,
        title: "Save configurations",
        description: "Persist setups in local storage.",
      },
      {
        icon: IconUpload,
        title: "Export / import",
        description: "Share configs as JSON with your team.",
      },
      {
        icon: IconArrowBackUp,
        title: "Undo / redo",
        description: "Walk through configuration history.",
      },
      {
        icon: IconBulb,
        title: "Best-practice hints",
        description: "Real-time suggestions as you configure.",
      },
      {
        icon: IconCurrencyDollar,
        title: "Cost estimation",
        description: "Rough monthly CI minutes and spend.",
      },
      {
        icon: IconDeviceMobile,
        title: "Fully responsive",
        description: "Configure pipelines from desktop or mobile.",
      },
      {
        icon: IconSparkles,
        title: "Pipeline optimization",
        description: "Parallel tests, caching, and Docker BuildKit.",
      },
    ],
  },
];

const spotlight = [
  {
    icon: IconBolt,
    title: "Generate in one click",
    stat: "< 60s",
    statLabel: "avg. setup time",
  },
  {
    icon: IconShieldLock,
    title: "Security by default",
    stat: "10+",
    statLabel: "scan & audit options",
  },
  {
    icon: IconCloud,
    title: "Deploy anywhere",
    stat: "12",
    statLabel: "deploy targets",
  },
];

export function Features() {
  const [activeCategory, setActiveCategory] = useState(featureCategories[0].id);
  const category =
    featureCategories.find((c) => c.id === activeCategory) ?? featureCategories[0];

  return (
    <section id="features" className="section-surface relative py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg opacity-50" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            Features
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for real
            <span className="text-primary"> engineering teams</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            From first commit to production deploy — every option you need, nothing you don&apos;t.
          </p>
        </div>

        {/* Spotlight bento */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {spotlight.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-mono text-2xl font-bold tracking-tight text-primary">
                  {item.stat}
                </p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {item.statLabel}
                </p>
                <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Category filter + grid */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-lg backdrop-blur-sm">
          <div className="border-b bg-muted/30 px-4 py-4 sm:px-6">
            <div
              role="tablist"
              aria-label="Feature categories"
              className="flex flex-wrap gap-2"
            >
              {featureCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    activeCategory === cat.id
                      ? "bg-background text-foreground ring-1 ring-inset ring-border"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{category.description}</p>
          </div>

          <div
            role="tabpanel"
            className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3"
          >
            {category.features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex gap-3 rounded-xl border border-border/50 bg-muted/20 p-4 transition-colors hover:border-primary/25 hover:bg-primary/5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{feature.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
