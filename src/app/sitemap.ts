import type { MetadataRoute } from "next";

import { projects } from "@/content/projects";
import { siteUrl } from "@/content/site";

const staticRoutes = ["", "/projects", "/services", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route || "/"}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));

  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...pages, ...projectPages];
}
