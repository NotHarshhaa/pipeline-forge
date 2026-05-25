import { instructionHighlights } from "./data";

export function InstructionsHighlights() {
  return (
    <div className="mb-12">
      <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
        What you get
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Pipeline Forge covers the full path from commit to deploy.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {instructionHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/60 p-4 backdrop-blur-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
