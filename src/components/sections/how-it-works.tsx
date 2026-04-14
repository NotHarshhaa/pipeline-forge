import { Badge } from "@/components/ui/badge";

const steps = [
  {
    number: "01",
    title: "Select your stack",
    description: "Choose from Node.js, Python, Java, Go, Rust, or .NET.",
  },
  {
    number: "02",
    title: "Pick your CI provider",
    description: "GitHub Actions, GitLab CI, Jenkins, CircleCI, or Azure Pipelines.",
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge variant="secondary" className="mb-2 sm:mb-3">How It Works</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Four simple steps
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            From zero to a production-ready pipeline in under a minute.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
              )}
              <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
