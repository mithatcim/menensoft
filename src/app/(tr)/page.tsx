import { BuyerBridge } from "@/components/home/buyer-bridge";
import { ExploreHubs } from "@/components/home/explore-hubs";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { FlagshipStory } from "@/components/home/flagship-story";
import { HeroSection } from "@/components/home/hero-section";
import { OpeningShowcase } from "@/components/home/opening-showcase";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { SystemLayers } from "@/components/home/system-layers";
import { VisualGateway } from "@/components/home/visual-gateway";
import { ContactCTA } from "@/components/shared/contact-cta";
import { TelemetryDivider } from "@/components/shared/telemetry-divider";

export default function HomePage() {
  return (
    <>
      {/* Phase 41A: the clear offer leads. The hero states what Menensoft builds,
          who for and what to do (and owns the page's h1); the problem showcase
          now follows it as supporting context instead of being the first screen. */}
      <HeroSection />
      <OpeningShowcase />
      <VisualGateway />
      <FlagshipStory />
      <TelemetryDivider code="SYS·01" label="ihtiyaçtan sisteme" />
      <BuyerBridge />
      <SystemLayers />
      <TelemetryDivider code="SYS·02" label="seçili işler" />
      <FeaturedProjectsSection />
      <TelemetryDivider code="SYS·03" label="çözümler" />
      <ServicesPreviewSection />
      <TelemetryDivider code="SYS·04" label="keşif" />
      <ExploreHubs />
      <ContactCTA />
    </>
  );
}
