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
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
];

export function Features() {
  return (
    <section id="features" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <Badge variant="secondary" className="mb-2 sm:mb-4">Features</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Everything you need for CI/CD
          </h2>
          <p className="mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Built with best practices so you can ship faster and safer.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:shadow-md transition-all hover:border-primary/30"
              >
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2 sm:mb-3 md:mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg mb-1 sm:mb-1.5 md:mb-2">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
