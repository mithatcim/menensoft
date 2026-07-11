import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { sectors } from "@/content/sectors";
import { siteUrl } from "@/content/site";

// Yalnızca kanonik Türkçe rotalar; eski İngilizce rotalar 308 ile yönlenir.
const staticRoutes = [
  "",
  "/projeler",
  "/cozumler",
  "/surec",
  "/teklif-al",
  "/sss",
  "/hakkimda",
  "/iletisim",
  "/sektorler",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projeler/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sectorPages: MetadataRoute.Sitemap = sectors.map((sector) => ({
    url: `${siteUrl}/sektorler/${sector.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...projectPages, ...sectorPages];
}
