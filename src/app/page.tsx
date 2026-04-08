import {
  IconBolt,
  IconPuzzle,
  IconRefresh,
  IconBrandDocker,
  IconCloud,
  IconShieldLock,
  IconFileText,
  IconBrandGithub,
  IconBrandNextjs,
  IconBrandTailwind,
  IconServer,
  IconStar,
  IconArrowRight,
  IconCircleCheck,
  IconCircleDashed,
  IconHeart,
  IconBrandNodejs,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PipelineGenerator } from "@/components/pipeline-generator";

const features = [
  {
    icon: IconBolt,
    title: "Instant Generation",
    description: "Generate CI/CD pipelines in seconds, not hours.",
  },
  {
    icon: IconPuzzle,
    title: "Multi-Stack Support",
    description: "Node.js, Python, Java, Go, Rust, and .NET supported.",
  },
  {
    icon: IconRefresh,
    title: "Multiple CI Providers",
    description: "GitHub Actions supported. GitLab CI coming soon.",
  },
  {
    icon: IconBrandDocker,
    title: "Docker Support",
    description: "Built-in Docker build and push configurations.",
  },
  {
    icon: IconCloud,
    title: "Deployment Ready",
    description: "AWS ECS and Kubernetes deployment configs included.",
  },
  {
    icon: IconShieldLock,
    title: "Security Best Practices",
    description: "Security scanning and audit steps built in.",
  },
];

const steps = [
  {
    number: "01",
    title: "Select your stack",
    description: "Choose from Node.js, Python, Java, Go, Rust, or .NET.",
  },
  {
    number: "02",
    title: "Pick your CI provider",
    description: "GitHub Actions or GitLab CI (coming soon).",
  },
  {
    number: "03",
    title: "Configure your pipeline",
    description: "Toggle linting, tests, Docker, deployment, and more.",
  },
  {
    number: "04",
    title: "Generate & download",
    description: "Get clean YAML output instantly. Copy or download.",
  },
];

const roadmap = [
  { label: "GitLab CI support", done: false },
  { label: "Jenkins pipeline generation", done: false },
  { label: "Kubernetes deployment templates", done: false },
  { label: "AI-powered pipeline optimization", done: false },
  { label: "Pipeline visualization (graph view)", done: false },
  { label: "Cost estimation per pipeline", done: false },
];

const exampleYaml = `name: CI Pipeline

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npm test
      - run: npm run build`;

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <IconBrandNodejs className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Pipeline Forge
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#generator" className="hover:text-foreground transition-colors">Generator</a>
            <a href="#roadmap" className="hover:text-foreground transition-colors">Roadmap</a>
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <IconBrandGithub className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
            </a>
            <a href="#generator">
              <Button size="sm" className="gap-2">
                <IconBolt className="h-4 w-4" />
                Get Started
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
              Open Source CI/CD Pipeline Generator
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Generate Production-Ready
              <br />
              <span className="text-primary">CI/CD Pipelines</span>
              <br />
              in Seconds
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Pipeline Forge is a developer-first tool that helps you create
              optimized, secure, and scalable CI/CD pipelines for modern
              applications — without writing YAML from scratch.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#generator">
                <Button size="lg" className="gap-2 text-base font-semibold px-8">
                  <IconBolt className="h-5 w-5" />
                  Start Building
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                  Learn More
                  <IconArrowRight className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Example output preview */}
            <div className="mt-16 mx-auto max-w-2xl">
              <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
                <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="ml-2 text-xs text-muted-foreground font-mono">
                    .github/workflows/ci.yml
                  </span>
                </div>
                <pre className="p-4 text-left text-sm font-mono text-foreground/80 overflow-auto max-h-64 leading-relaxed">
                  <code>{exampleYaml}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Everything you need for CI/CD
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Built with best practices so you can ship faster and safer.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={feature.title}
                    className="group hover:shadow-md transition-all hover:border-primary/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Four simple steps
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                From zero to a production-ready pipeline in under a minute.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, i) => (
                <div key={step.number} className="relative text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold mb-4">
                    {step.number}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Generator Section */}
        <section id="generator" className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Generator</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Build your pipeline
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Configure your project settings and generate optimized CI/CD YAML instantly.
              </p>
            </div>
            <PipelineGenerator />
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Tech Stack</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Built with modern tools
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: IconBrandNextjs, label: "Next.js" },
                { icon: IconBrandTailwind, label: "Tailwind CSS" },
                { icon: IconFileText, label: "shadcn/ui" },
                { icon: IconServer, label: "Node.js" },
              ].map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.label}
                    className="flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center"
                  >
                    <Icon className="h-8 w-8 text-primary" />
                    <span className="font-medium text-sm">{tech.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4">Roadmap</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                What&apos;s coming next
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We&apos;re constantly improving Pipeline Forge.
              </p>
            </div>
            <div className="max-w-xl mx-auto space-y-4">
              {roadmap.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4"
                >
                  {item.done ? (
                    <IconCircleCheck className="h-5 w-5 text-green-500 shrink-0" />
                  ) : (
                    <IconCircleDashed className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${item.done ? "line-through text-muted-foreground" : ""}`}>
                    {item.label}
                  </span>
                  {!item.done && (
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      Planned
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Ready to simplify your DevOps?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stop writing YAML from scratch. Generate production-ready
                pipelines in seconds.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#generator">
                  <Button size="lg" className="gap-2 text-base font-semibold px-8">
                    <IconBolt className="h-5 w-5" />
                    Generate Now
                  </Button>
                </a>
                <a
                  href="https://github.com/NotHarshhaa/pipeline-forge"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                    <IconStar className="h-4 w-4" />
                    Star on GitHub
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconBrandNodejs className="h-4 w-4" />
              </div>
              <span className="font-bold">Pipeline Forge</span>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Built with <IconHeart className="h-3.5 w-3.5 text-primary" /> to
              simplify DevOps workflows
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>MIT License</span>
              <Separator orientation="vertical" className="h-4" />
              <a
                href="https://github.com/NotHarshhaa/pipeline-forge"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <IconBrandGithub className="h-4 w-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
