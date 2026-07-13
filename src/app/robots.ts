import type { MetadataRoute } from "next";

import { siteUrl } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin panel and the write endpoint. Neither is linked from anywhere
      // public and both are gated server-side, so this is not the protection —
      // the session check is. It exists so the customer list is not merely
      // unlinked but explicitly out of bounds, and so a crawler does not spend
      // its budget on POST-only routes that can only answer 405.
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
