import BetaFooter from "@/presentation/screens/landing/sections/BetaFooter";
import CrawlSection from "@/presentation/screens/landing/sections/CrawlSection";
import FleetRanks from "@/presentation/screens/landing/sections/FleetRanks";
import Hero from "@/presentation/screens/landing/sections/Hero";
import Systems from "@/presentation/screens/landing/sections/Systems";

export default function LandingScreen() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <CrawlSection />
      <Systems />
      <FleetRanks />
      <BetaFooter />
    </main>
  );
}
