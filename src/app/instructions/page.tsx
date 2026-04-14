"use client";

import { IconBolt, IconSettings, IconRocket, IconDownload, IconCopy, IconCheck, IconArrowRight, IconDeviceFloppy, IconRefresh, IconCode, IconTerminal, IconCloud } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/sections/navbar";
import Link from "next/link";

const steps = [
  {
    icon: IconBolt,
    title: "Choose a Quick Preset",
    description: "Start with a pre-configured template for common use cases like Basic Node.js, Production Node.js, Python API, Docker/K8s, or Full Featured. This gives you a head start with optimized configurations.",
    tips: [
      "Use 'Basic Node.js' for simple projects",
      "Use 'Production Node.js' for apps with security and deployment",
      "Use 'Docker/K8s' for containerized applications"
    ]
  },
  {
    icon: IconSettings,
    title: "Configure Project Details",
    description: "Enter your project name, select your technology stack (Node.js, Python, Java, Go, Rust, .NET), choose package manager, and configure monorepo settings if applicable.",
    tips: [
      "Project name appears in your pipeline files",
      "Package manager determines install commands",
      "Monorepo support includes Nx, Turborepo, Lerna"
    ]
  },
  {
    icon: IconCode,
    title: "Select CI/CD Provider",
    description: "Choose your pipeline platform from GitHub Actions, GitLab CI, Jenkins, CircleCI, or Azure Pipelines. Configure provider-specific settings like concurrency, timeout, and parallel jobs.",
    tips: [
      "GitHub Actions is most popular for GitHub repos",
      "GitLab CI integrates seamlessly with GitLab",
      "Jenkins offers self-hosted flexibility"
    ]
  },
  {
    icon: IconTerminal,
    title: "Configure Pipeline Steps",
    description: "Select which steps your pipeline should run: linting, unit tests, E2E tests, code formatting, type checking, build, security scanning, dependency audit, Docker build, and container scan.",
    tips: [
      "Enable linting and tests for code quality",
      "Security scanning detects vulnerabilities",
      "Docker support for containerized apps"
    ]
  },
  {
    icon: IconCloud,
    title: "Choose Deployment Target",
    description: "Select where to deploy your application: AWS ECS, Kubernetes, Vercel, Netlify, Heroku, Azure App Service, or Google Cloud Platform. Each target generates appropriate deployment configurations.",
    tips: [
      "Vercel for frontend apps with zero-config",
      "Kubernetes for complex container orchestration",
      "AWS ECS for scalable container deployments"
    ]
  },
  {
    icon: IconRocket,
    title: "Add Advanced Features (Optional)",
    description: "Enhance your pipeline with environment variables, custom scripts, notifications (Slack/Email), matrix builds for multi-version testing, artifact management, scheduled pipelines, code quality gates, performance testing, and database services.",
    tips: [
      "Matrix builds test across multiple versions",
      "Notifications keep your team informed",
      "Scheduled pipelines run automatically"
    ]
  },
  {
    icon: IconDeviceFloppy,
    title: "Save Your Configuration",
    description: "Save your configuration locally with a custom name. You can save multiple configurations for different projects or environments. Configurations persist in your browser's local storage.",
    tips: [
      "Save configurations for different branches",
      "Name configs descriptively (e.g., 'prod-nodejs')",
      "Export configs as JSON for sharing"
    ]
  },
  {
    icon: IconDownload,
    title: "Generate and Export",
    description: "Click 'Generate Pipeline' to create your YAML configuration. Review the syntax-highlighted output, then copy to clipboard or download as a file. You can also export your configuration as JSON for backup or sharing.",
    tips: [
      "Copy YAML directly to clipboard",
      "Download file for commit to repo",
      "Export JSON for configuration versioning"
    ]
  },
];

const features = [
  { icon: IconBolt, title: "Instant Generation", desc: "Generate pipelines in seconds, not hours" },
  { icon: IconSettings, title: "Best Practices", desc: "Built-in security and quality checks" },
  { icon: IconRefresh, title: "Multi-Provider", desc: "Support for 5 major CI/CD platforms" },
  { icon: IconCode, title: "Clean YAML", desc: "Production-ready, well-formatted output" },
  { icon: IconDeviceFloppy, title: "Save & Load", desc: "Persistent configuration storage" },
  { icon: IconTerminal, title: "Customizable", desc: "Extensive configuration options" },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Hero */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <Badge variant="secondary" className="mb-2 sm:mb-3">Documentation</Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4">
            How to Generate CI/CD Pipelines
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Follow these simple steps to create production-ready CI/CD pipelines in seconds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex flex-col items-center text-center p-2 sm:p-3 rounded-lg border bg-card">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary mb-1 sm:mb-2" />
                  <h3 className="text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6">Step-by-Step Guide</h2>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="overflow-hidden">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          Step {index + 1}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg md:text-xl">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  {step.tips.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3 sm:p-4">
                      <h4 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                        <IconCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        Pro Tips
                      </h4>
                      <ul className="space-y-1.5 sm:space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-[10px] sm:text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5 sm:mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">Ready to Build Your Pipeline?</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                Start generating your CI/CD pipeline now with our intuitive interface.
              </p>
              <Link href="/#generator">
                <Button size="lg" className="gap-2 text-sm sm:text-base">
                  Go to Generator
                  <IconArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
