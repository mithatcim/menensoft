import { notFound } from "next/navigation";

import { LandingPageView } from "@/components/landing/landing-page";
import { getLandingPageEn } from "@/content/en/landing";
import { pageMeta } from "@/lib/seo";

const page = getLandingPageEn("ecommerce-website");

export const metadata = page
  ? pageMeta({
      title: page.seoTitle,
      description: page.seoDescription,
      path: "/en/ecommerce-website",
    })
  : {};

export default function Page() {
  if (!page) notFound();
  return <LandingPageView page={page} locale="en" />;
}
