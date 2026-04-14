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
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

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
    description: "GitHub Actions, GitLab CI, Jenkins, CircleCI, Azure Pipelines.",
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
  {
    icon: IconSettings,
    title: "Environment Variables",
    description: "Add custom environment variables to your pipelines easily.",
  },
  {
    icon: IconTerminal,
    title: "Custom Scripts",
    description: "Insert pre-build, pre-test, and post-build custom commands.",
  },
  {
    icon: IconBell,
    title: "Smart Notifications",
    description: "Slack and email notifications for pipeline status updates.",
  },
  {
    icon: IconGitBranch,
    title: "Matrix Builds",
    description: "Test across multiple versions simultaneously with parallel jobs.",
  },
  {
    icon: IconPackage,
    title: "Artifact Management",
    description: "Upload and store build artifacts with configurable retention.",
  },
  {
    icon: IconClock,
    title: "Scheduled Pipelines",
    description: "Run pipelines on a schedule with cron expressions.",
  },
  {
    icon: IconChartBar,
    title: "Code Quality & Coverage",
    description: "Set coverage thresholds and quality gates for your code.",
  },
  {
    icon: IconRocket,
    title: "Performance Testing",
    description: "Load testing and performance benchmarks for your application.",
  },
  {
    icon: IconDatabase,
    title: "Database & Services",
    description: "Configure databases, Redis, and Elasticsearch services.",
  },
  {
    icon: IconDeviceFloppy,
    title: "Configuration Persistence",
    description: "Save and load your configurations with local storage.",
  },
  {
    icon: IconPalette,
    title: "Syntax Highlighting",
    description: "Color-coded YAML output for better readability.",
  },
  {
    icon: IconTemplate,
    title: "Quick Presets",
    description: "Pre-configured templates for common use cases.",
  },
  {
    icon: IconUpload,
    title: "Export/Import",
    description: "Share configurations as JSON files.",
  },
  {
    icon: IconArrowBackUp,
    title: "Undo/Redo",
    description: "Navigate through configuration history with ease.",
  },
  {
    icon: IconBulb,
    title: "Best Practices Analyzer",
    description: "Real-time suggestions for optimal pipeline configuration.",
  },
  {
    icon: IconCurrencyDollar,
    title: "Cost Estimation",
    description: "Estimate monthly CI/CD costs based on your configuration.",
  },
  {
    icon: IconDeviceMobile,
    title: "Responsive Design",
    description: "Fully responsive UI optimized for mobile and desktop.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-6 sm:py-8 md:py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge variant="secondary" className="mb-2 sm:mb-3">Features</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Everything you need for CI/CD
          </h2>
          <p className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Built with best practices so you can ship faster and safer.
          </p>
        </div>

        {/* New Clean List Design */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-x-6 sm:gap-x-8 md:gap-x-12 gap-y-3 sm:gap-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-background/50 transition-all"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <IconCheck className="h-4 w-4 text-primary" />
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
