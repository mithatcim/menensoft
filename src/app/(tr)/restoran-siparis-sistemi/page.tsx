import { notFound } from "next/navigation";

import { LandingPageView } from "@/components/landing/landing-page";
import { getLandingPage } from "@/content/landing";
import { pageMeta } from "@/lib/seo";

const page = getLandingPage("restoran-siparis-sistemi");

export const metadata = page
  ? pageMeta({
      title: page.seoTitle,
      description: page.seoDescription,
      path: "/restoran-siparis-sistemi",
    })
  : {};

export default function Page() {
  if (!page) notFound();
  return <LandingPageView page={page} locale="tr" />;
}
