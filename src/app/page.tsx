import { CapabilitiesSection } from "@/components/home/capabilities-section";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { ContactCTA } from "@/components/shared/contact-cta";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProjectsSection />
      <CapabilitiesSection />
      <ServicesPreviewSection />
      <ContactCTA />
    </>
  );
}
