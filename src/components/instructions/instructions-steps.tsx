import { IconCheck } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { instructionSteps } from "./data";

export function InstructionsSteps() {
  return (
    <div id="guide">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Step-by-step guide
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Follow in order, or jump via the sidebar on desktop.
          </p>
        </div>
        <Badge variant="outline" className="w-fit font-mono text-xs">
          {instructionSteps.length} steps
        </Badge>
      </div>

      <ol className="relative space-y-8">
        <div
          className="absolute left-[19px] top-3 hidden h-[calc(100%-24px)] w-px bg-gradient-to-b from-primary/50 via-border to-transparent sm:block"
          aria-hidden
        />

        {instructionSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.id} id={step.id} className="relative scroll-mt-28">
              <article className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md sm:ml-0">
                <div className="flex flex-col gap-4 border-b border-border/50 bg-muted/20 p-5 sm:flex-row sm:items-start sm:gap-5 sm:p-6">
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <Badge variant="secondary" className="mb-2 text-[10px]">
                      Step {index + 1}
                    </Badge>
                    <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {step.tips.length > 0 && (
                  <div className="p-5 sm:p-6">
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        <IconCheck className="h-4 w-4 text-primary" />
                        Pro tips
                      </h4>
                      <ul className="space-y-2">
                        {step.tips.map((tip) => (
                          <li
                            key={tip}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary"
                              aria-hidden
                            />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
