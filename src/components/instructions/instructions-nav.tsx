import { instructionSteps } from "./data";
import { cn } from "@/lib/utils";

export function InstructionsNav() {
  return (
    <nav
      aria-label="Guide sections"
      className="hidden lg:block lg:sticky lg:top-24 lg:self-start"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-0.5 border-l border-border/80 pl-3">
        {instructionSteps.map((step, index) => (
          <li key={step.id}>
            <a
              href={`#${step.id}`}
              className={cn(
                "block rounded-md py-1.5 pl-2 text-sm text-muted-foreground transition-colors",
                "hover:bg-muted/50 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <span className="font-mono text-[10px] text-muted-foreground/80 mr-1.5">
                {String(index + 1).padStart(2, "0")}
              </span>
              {step.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
