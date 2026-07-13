import { PrivacyBody } from "@/components/legal/privacy-body";
import { privacyPage } from "@/content/privacy";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Gizlilik",
  description:
    "Bu site hangi veriyi neden işliyor: form verisi, çerezsiz analitik, ham IP saklanmaz. Şablon değil — sitenin gerçek davranışı.",
  path: "/gizlilik",
});

export default function PrivacyPage() {
  return <PrivacyBody {...privacyPage} />;
}
