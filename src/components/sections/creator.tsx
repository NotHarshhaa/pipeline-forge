import { IconBrandGithub, IconStar } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Creator() {
  return (
    <section id="creator" className="py-6 sm:py-8 md:py-12 lg:py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Badge variant="secondary" className="mb-2 sm:mb-3">Meet the Creator</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
            Built by a passionate engineer
          </h2>
        </div>
        <div className="mx-auto max-w-2xl sm:max-w-3xl md:max-w-3xl lg:max-w-4xl">
          <Card className="overflow-hidden">
            <CardContent className="p-3 sm:p-6 md:p-8">
              <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl" />
                  <img
                    src="https://github.com/NotHarshhaa.png"
                    alt="Harshhaa"
                    className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-primary/20 shadow-lg"
                  />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wider">
                    H A R S H H A A
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed">
                    Development Platform & Automation Enthusiast | Cloud, DevOps & MLops Engineer | Platform Engineering
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-2 sm:pt-4 w-full sm:w-auto">
                  <a
                    href="https://github.com/NotHarshhaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="default" className="gap-2 w-full sm:w-auto text-xs sm:text-sm">
                      <IconBrandGithub className="h-4 w-4" />
                      Follow on GitHub
                    </Button>
                  </a>
                  <a
                    href="https://github.com/NotHarshhaa/pipeline-forge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button variant="outline" className="gap-2 w-full sm:w-auto text-xs sm:text-sm">
                      <IconStar className="h-4 w-4" />
                      Star this Project
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
