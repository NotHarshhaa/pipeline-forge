import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Generator } from "@/components/sections/generator";
import { TechStack } from "@/components/sections/tech-stack";
import { Roadmap } from "@/components/sections/roadmap";
import { Creator } from "@/components/sections/creator";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <Generator />
        <TechStack />
        <Roadmap />
        <Creator />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
