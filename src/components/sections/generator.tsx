import { Badge } from "@/components/ui/badge";
import { PipelineGenerator } from "@/components/pipeline-generator";

export function Generator() {
  return (
    <section id="generator" className="py-6 sm:py-8 md:py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge variant="secondary" className="mb-2 sm:mb-3">Generator</Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Build your pipeline
          </h2>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Configure your project settings and generate optimized CI/CD YAML instantly.
          </p>
        </div>
        <PipelineGenerator />
      </div>
    </section>
  );
}
