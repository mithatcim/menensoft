import { notFound } from "next/navigation";

import { LandingPageView } from "@/components/landing/landing-page";
import { getLandingPageEn } from "@/content/en/landing";
import { pageMeta } from "@/lib/seo";

const page = getLandingPageEn("web-systems-for-business");

export const metadata = page
  ? pageMeta({
      title: page.seoTitle,
      description: page.seoDescription,
      path: "/en/web-systems-for-business",
    })
  : {};

export default function Page() {
  if (!page) notFound();
  return <LandingPageView page={page} locale="en" />;
}
