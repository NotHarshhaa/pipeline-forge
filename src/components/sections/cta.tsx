import { IconBolt, IconStar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
            Ready to simplify your DevOps?
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 md:mb-8 px-2">
            Stop writing YAML from scratch. Generate production-ready
            pipelines in seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
            <a href="#generator" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 text-sm sm:text-base md:text-base font-semibold px-6 sm:px-8 w-full sm:w-auto">
                <IconBolt className="h-4 w-4 sm:h-5 sm:w-5" />
                Generate Now
              </Button>
            </a>
            <a
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base md:text-base px-6 sm:px-8 w-full sm:w-auto">
                <IconStar className="h-4 w-4" />
                Star on GitHub
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
