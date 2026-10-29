import { Calculator } from "@/components/calculator";
import { Hero } from "@/components/hero";
import { LeadModal } from "@/components/lead-modal";
import { SiteNav } from "@/components/nav";
import { ProofTicker } from "@/components/proof-ticker";
import { BottomBar, PromoBand } from "@/components/promo";
import { CountdownProvider, LeadProvider } from "@/components/providers";
import { Reviews } from "@/components/reviews";
import { ScrollEffects } from "@/components/scroll-effects";
import { Compare, Control, Faq, FinalCta, HowItWorks, LogoMarquee, Pain, Pricing, Showcase, SiteFooter } from "@/components/sections";

export default function HomePage() {
  return (
    <CountdownProvider>
      <LeadProvider>
        <PromoBand />
        <SiteNav />
        <Hero />
        <LogoMarquee />
        <Pain />
        <HowItWorks />
        <Showcase />
        <Control />
        <Calculator />
        <Compare />
        <Reviews />
        <Pricing />
        <Faq />
        <FinalCta />
        <SiteFooter />
        <BottomBar />
        <LeadModal />
        <ProofTicker />
        <ScrollEffects />
      </LeadProvider>
    </CountdownProvider>
  );
}
