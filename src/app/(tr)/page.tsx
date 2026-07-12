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
      <OpeningShowcase />
      <HeroSection />
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
