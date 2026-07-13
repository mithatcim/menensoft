import { PrivacyBody } from "@/components/legal/privacy-body";
import { privacyPageEn } from "@/content/en/privacy";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Privacy",
  description:
    "What this site collects and why: form data, cookieless analytics, no raw IP stored. Not a template — what the site actually does.",
  path: "/en/privacy",
});

export default function EnPrivacyPage() {
  return <PrivacyBody {...privacyPageEn} />;
}
