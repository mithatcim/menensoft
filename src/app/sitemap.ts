import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";
import { enPathFor } from "@/lib/locale";
import {
  projectRoutes,
  sectorRoutes,
  staticRoutes,
  systemRoutes,
} from "@/lib/routes";

/**
 * Sitemap src/lib/routes.ts + src/lib/locale.ts envanterinden beslenir:
 * her Türkçe kanonik rota ve /en altındaki İngilizce eşdeğeri, karşılıklı
 * hreflang alternates ile listelenir. Yönlendirmeler ve metadata rotaları
 * bilinçli olarak dışarıdadır.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pair = (
    trRoute: string,
    priority: number,
  ): MetadataRoute.Sitemap => {
    const trPath = trRoute || "/";
    const enPath = enPathFor(trRoute);
    const alternates = {
      languages: {
        tr: `${siteUrl}${trPath}`,
        en: `${siteUrl}${enPath}`,
        "x-default": `${siteUrl}${trPath}`,
      },
    };
    return [
      {
        url: `${siteUrl}${trPath}`,
        changeFrequency: "monthly",
        priority,
        alternates,
      },
      {
        url: `${siteUrl}${enPath}`,
        changeFrequency: "monthly",
        priority: Math.max(priority - 0.1, 0.1),
        alternates,
      },
    ];
  };

  return [
    ...staticRoutes.flatMap((r) => pair(r, r === "" ? 1 : 0.8)),
    ...projectRoutes.flatMap((r) => pair(r, 0.6)),
    ...sectorRoutes.flatMap((r) => pair(r, 0.7)),
    ...systemRoutes.flatMap((r) => pair(r, 0.7)),
  ];
}
