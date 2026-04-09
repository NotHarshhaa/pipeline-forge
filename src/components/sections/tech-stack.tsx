import { IconBrandNextjs, IconBrandTailwind, IconFileText, IconServer } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export function TechStack() {
  const techStack = [
    { icon: IconBrandNextjs, label: "Next.js" },
    { icon: IconBrandTailwind, label: "Tailwind CSS" },
    { icon: IconFileText, label: "shadcn/ui" },
    { icon: IconServer, label: "Node.js" },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <Badge variant="secondary" className="mb-4">Tech Stack</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Built with modern tools
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.label}
                className="flex flex-col items-center gap-2 sm:gap-3 rounded-xl border bg-card p-4 sm:p-6 text-center"
              >
                <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <span className="font-medium text-xs sm:text-sm">{tech.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
