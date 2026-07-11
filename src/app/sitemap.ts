import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";
import {
  projectRoutes,
  sectorRoutes,
  staticRoutes,
  systemRoutes,
} from "@/lib/routes";

/**
 * Sitemap yalnızca src/lib/routes.ts envanterinden beslenir — rota
 * eklemek/çıkarmak için orayı güncelle. İngilizce yönlendirmeler ve
 * metadata rotaları bilinçli olarak dışarıdadır.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (
    route: string,
    priority: number,
  ): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${route || "/"}`,
    changeFrequency: "monthly",
    priority,
  });

  return [
    ...staticRoutes.map((r) => entry(r, r === "" ? 1 : 0.8)),
    ...projectRoutes.map((r) => entry(r, 0.6)),
    ...sectorRoutes.map((r) => entry(r, 0.7)),
    ...systemRoutes.map((r) => entry(r, 0.7)),
  ];
}
