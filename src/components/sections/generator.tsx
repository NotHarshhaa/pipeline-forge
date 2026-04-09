import { Badge } from "@/components/ui/badge";
import { PipelineGenerator } from "@/components/pipeline-generator";

export function Generator() {
  return (
    <section id="generator" className="py-12 sm:py-16 md:py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <Badge variant="secondary" className="mb-4">Generator</Badge>
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
