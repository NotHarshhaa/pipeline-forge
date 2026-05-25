import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconStack2,
  IconBrandGithub,
  IconAdjustments,
  IconDownload,
  IconArrowRight,
} from "@tabler/icons-react";

const steps = [
  {
    number: "01",
    title: "Select your stack",
    description: "Node.js, Python, Java, Go, Rust, or .NET — with package manager defaults.",
    icon: IconStack2,
  },
  {
    number: "02",
    title: "Pick your CI provider",
    description: "GitHub Actions, GitLab CI, Jenkins, CircleCI, or Azure Pipelines.",
    icon: IconBrandGithub,
  },
  {
    number: "03",
    title: "Configure the pipeline",
    description: "Toggle tests, Docker, security scans, deploy targets, and advanced options.",
    icon: IconAdjustments,
  },
  {
    number: "04",
    title: "Generate & ship",
    description: "Copy or download YAML. Drop it into your repo and push.",
    icon: IconDownload,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-surface relative border-b py-16 sm:py-20 lg:py-24">
      <div className="generator-grid-bg opacity-60" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge
            variant="secondary"
            className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium"
          >
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Four steps to a
            <span className="text-primary"> production pipeline</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            No YAML archaeology. Configure visually, preview instantly, export when ready.
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div
            className="absolute left-8 top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:left-1/2 lg:block lg:-translate-x-1/2"
            aria-hidden
          />

          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="relative flex flex-col rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground/80">
                      {step.number}
                    </span>
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className="absolute -right-3 top-1/2 hidden h-px w-6 -translate-y-1/2 border-t border-dashed border-primary/30 lg:block"
                      aria-hidden
                    />
                  )}

                  <h3 className="text-base font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" className="gap-2 font-semibold" asChild>
            <a href="#generator">
              Try it now
              <IconArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
