import { CapabilityConsole } from "@/components/home/capability-console";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { FlagshipStory } from "@/components/home/flagship-story";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { SystemLayers } from "@/components/home/system-layers";
import { ContactCTA } from "@/components/shared/contact-cta";
import { TelemetryDivider } from "@/components/shared/telemetry-divider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FlagshipStory />
      <SystemLayers />
      <TelemetryDivider code="SYS·02" label="yetkinlik konsolu" />
      <CapabilityConsole />
      <TelemetryDivider code="SYS·03" label="seçili işler" />
      <FeaturedProjectsSection />
      <TelemetryDivider code="SYS·04" label="çözümler" />
      <ServicesPreviewSection />
      <ContactCTA />
    </>
  );
}
