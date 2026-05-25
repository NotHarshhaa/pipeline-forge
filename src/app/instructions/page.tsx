import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { InstructionsHero } from "@/components/instructions/instructions-hero";
import { InstructionsNav } from "@/components/instructions/instructions-nav";
import { InstructionsHighlights } from "@/components/instructions/instructions-highlights";
import { InstructionsSteps } from "@/components/instructions/instructions-steps";
import { InstructionsCta } from "@/components/instructions/instructions-cta";

export default function InstructionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <InstructionsHero />

        <section className="section-surface relative py-12 sm:py-16 lg:py-20">
          <div className="generator-grid-bg opacity-40" aria-hidden />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)]">
              <InstructionsNav />

              <div className="min-w-0">
                <InstructionsHighlights />
                <InstructionsSteps />
                <InstructionsCta />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
