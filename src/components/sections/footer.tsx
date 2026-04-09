import { IconBrandGithub, IconHeart, IconBrandNodejs } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <IconBrandNodejs className="h-4 w-4" />
            </div>
            <span className="font-bold">Pipeline Forge</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 text-center">
            Built with <IconHeart className="h-3.5 w-3.5 text-primary" /> to
            simplify DevOps workflows
          </p>
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>MIT License</span>
            <Separator orientation="vertical" className="h-4" />
            <a
              href="https://github.com/NotHarshhaa/pipeline-forge"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <IconBrandGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
