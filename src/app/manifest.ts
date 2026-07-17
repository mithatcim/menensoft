import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description: site.subheadline,
    start_url: "/",
    display: "standalone",
    // Phase 44A: the public site is light (41E), so the install/splash colors
    // match it instead of the old near-black.
    background_color: "#f9f8f5",
    theme_color: "#f9f8f5",
    icons: [
      { src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      {
        src: "/brand/menensoft-app-icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/menensoft-app-icon-navy.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
