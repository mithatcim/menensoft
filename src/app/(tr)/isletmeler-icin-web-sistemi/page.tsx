import { notFound } from "next/navigation";

import { LandingPageView } from "@/components/landing/landing-page";
import { getLandingPage } from "@/content/landing";
import { pageMeta } from "@/lib/seo";

const page = getLandingPage("isletmeler-icin-web-sistemi");

export const metadata = page
  ? pageMeta({
      title: page.seoTitle,
      description: page.seoDescription,
      path: "/isletmeler-icin-web-sistemi",
    })
  : {};

export default function Page() {
  if (!page) notFound();
  return <LandingPageView page={page} locale="tr" />;
}
