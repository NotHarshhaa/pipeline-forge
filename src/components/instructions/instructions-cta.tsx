import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";

export function InstructionsCta() {
  return (
    <div className="mt-12 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-card/80 to-card/80 p-6 text-center shadow-lg sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <IconSparkles className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
        Ready to generate your pipeline?
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Open Pipeline Studio, pick a preset, and export YAML in one session.
      </p>
      <Button size="lg" className="mt-6 gap-2 font-semibold" asChild>
        <Link href="/#generator">
          Go to generator
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
