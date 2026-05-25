"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBolt,
  IconArrowRight,
  IconGitBranch,
  IconShieldCheck,
  IconClock,
  IconBrandGithub,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const examplePipelines = [
  {
    id: "github-actions",
    label: "GitHub",
    filename: ".github/workflows/ci.yml",
    code: `name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
      - run: npm run build`,
  },
  {
    id: "gitlab-ci",
    label: "GitLab",
    filename: ".gitlab-ci.yml",
    code: `stages: [build, test]

image: node:20-alpine

build:
  stage: build
  script:
    - npm ci
    - npm run build

test:
  stage: test
  script:
    - npm ci
    - npm test`,
  },
  {
    id: "jenkins",
    label: "Jenkins",
    filename: "Jenkinsfile",
    code: `pipeline {
  agent any
  stages {
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Test') {
      steps { sh 'npm test' }
    }
    stage('Build') {
      steps { sh 'npm run build' }
    }
  }
}`,
  },
  {
    id: "circleci",
    label: "CircleCI",
    filename: ".circleci/config.yml",
    code: `version: 2.1

jobs:
  build-and-test:
    docker:
      - image: cimg/node:20.0
    steps:
      - checkout
      - run: npm test
      - run: npm run build`,
  },
  {
    id: "azure-pipelines",
    label: "Azure",
    filename: "azure-pipelines.yml",
    code: `trigger: [main]

pool:
  vmImage: ubuntu-latest

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: "20"
  - script: npm ci
  - script: npm test
  - script: npm run build`,
  },
];

const stats = [
  { icon: IconGitBranch, label: "5 CI providers" },
  { icon: IconShieldCheck, label: "Security built-in" },
  { icon: IconClock, label: "Under 60 seconds" },
];

export function Hero() {
  const [selectedPipeline, setSelectedPipeline] = useState(0);
  const pipeline = examplePipelines[selectedPipeline];

  return (
    <section className="section-surface relative overflow-hidden border-b">
      <div className="generator-grid-bg" aria-hidden />
      <div className="generator-glow" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <Badge
              variant="secondary"
              className="mb-5 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
            >
              <IconBrandGithub className="h-3.5 w-3.5 text-primary" />
              Open source · Developer-first
            </Badge>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl xl:text-[3.25rem] xl:leading-[1.1]">
              Production-ready
              <span className="block text-primary">CI/CD pipelines</span>
              without YAML fatigue
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:mx-0">
              Pipeline Forge turns your stack, provider, and deployment choices into
              optimized YAML — with security scans, caching, and best-practice hints
              baked in.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto" asChild>
                <a href="#generator">
                  <IconBolt className="h-5 w-5" />
                  Open Pipeline Studio
                </a>
              </Button>
              <Button variant="outline" size="lg" className="w-full gap-2 sm:w-auto" asChild>
                <Link href="/instructions">
                  View docs
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {stats.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Terminal preview */}
          <div className="mx-auto w-full max-w-xl lg:max-w-none">
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <p className="text-xs font-medium text-muted-foreground">Live preview</p>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                Example output
              </span>
            </div>

            <div className="terminal-chrome shadow-2xl">
              <div className="terminal-titlebar">
                <span className="terminal-dot bg-[#ff5f57]" />
                <span className="terminal-dot bg-[#febc2e]" />
                <span className="terminal-dot bg-[#28c840]" />
                <span className="ml-2 truncate font-mono text-[11px] text-muted-foreground dark:text-white/70">
                  {pipeline.filename}
                </span>
              </div>

              <div className="border-b border-border bg-muted/60 px-2 py-2 dark:border-white/10 dark:bg-[oklch(0.22_0.02_322)]">
                <div
                  role="tablist"
                  aria-label="Example CI providers"
                  className="flex gap-1 overflow-x-auto scrollbar-hide"
                >
                  {examplePipelines.map((p, index) => (
                    <button
                      key={p.id}
                      type="button"
                      role="tab"
                      aria-selected={selectedPipeline === index}
                      onClick={() => setSelectedPipeline(index)}
                      className={cn(
                        "shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                        selectedPipeline === index
                          ? "bg-background text-foreground ring-1 ring-inset ring-border dark:bg-white/15 dark:text-white dark:ring-white/20"
                          : "text-muted-foreground hover:bg-background/80 hover:text-foreground dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white/80"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <pre className="terminal-code-area code-scrollbar max-h-56 overflow-auto p-4 text-left text-xs font-mono leading-relaxed sm:max-h-72 sm:text-[13px]">
                <code>{pipeline.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
