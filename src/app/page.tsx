import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { SystemFlowBand } from "@/components/home/system-flow-band";
import { ContactCTA } from "@/components/shared/contact-cta";
import { SectionDivider } from "@/components/shared/section-divider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SystemFlowBand />
      <SectionDivider />
      <FeaturedProjectsSection />
      <SectionDivider />
      <CapabilitiesSection />
      <SectionDivider />
      <ServicesPreviewSection />
      <ContactCTA />
    </>
  );
}
