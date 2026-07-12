import { BuyerBridge } from "@/components/home/buyer-bridge";
import { ExploreHubs } from "@/components/home/explore-hubs";
import { FeaturedProjectsSection } from "@/components/home/featured-projects-section";
import { FlagshipStory } from "@/components/home/flagship-story";
import { HeroSection } from "@/components/home/hero-section";
import { ServicesPreviewSection } from "@/components/home/services-preview-section";
import { SystemLayers } from "@/components/home/system-layers";
import { VisualGateway } from "@/components/home/visual-gateway";
import { ContactCTA } from "@/components/shared/contact-cta";
import { TelemetryDivider } from "@/components/shared/telemetry-divider";
import { siteEn } from "@/content/en/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: `${siteEn.role}`,
  description: siteEn.subheadline,
  path: "/en",
});

export default function EnHomePage() {
  return (
    <>
      <HeroSection locale="en" />
      <VisualGateway locale="en" />
      <FlagshipStory locale="en" />
      <TelemetryDivider code="SYS·01" label="from need to system" />
      <BuyerBridge locale="en" />
      <SystemLayers locale="en" />
      <TelemetryDivider code="SYS·02" label="selected work" />
      <FeaturedProjectsSection locale="en" />
      <TelemetryDivider code="SYS·03" label="solutions" />
      <ServicesPreviewSection locale="en" />
      <TelemetryDivider code="SYS·04" label="explore" />
      <ExploreHubs locale="en" />
      <ContactCTA locale="en" />
    </>
  );
}
