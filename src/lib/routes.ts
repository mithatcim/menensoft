import { projects } from "@/content/projects";
import { sectors } from "@/content/sectors";
import { systems } from "@/content/systems";

/**
 * Kanonik rota envanteri — tek doğruluk kaynağı.
 *
 * sitemap.ts buradan beslenir; scripts/audit.mjs canlı /sitemap.xml
 * üzerinden aynı envanteri doğrular. Yeni bir kanonik sayfa eklerken
 * SADECE burayı (ve içerik dosyasını) güncelle; sitemap ve denetim
 * otomatik takip eder. scripts/audit.mjs içindeki EXPECTED_CANONICAL_COUNT
 * sabitini de bilinçli olarak artırmayı unutma — sayaç, kazara rota
 * eklenmesine/düşmesine karşı ikinci bir kilittir.
 *
 * Kurallar:
 * - İngilizce uyumluluk rotaları (308 yönlendirme) sitemap'e GİRMEZ.
 * - Metadata rotaları (og image, robots, manifest...) sitemap'e GİRMEZ.
 */

/** Statik kanonik rotalar; "" ana sayfadır (sitemap önceliği için ayrık). */
export const staticRoutes = [
  "",
  "/projeler",
  "/cozumler",
  "/surec",
  "/teklif-al",
  "/sss",
  "/hakkimda",
  "/iletisim",
  "/sektorler",
  "/sistemler",
  "/neden-menensoft",
  "/hazir-site-mi-ozel-sistem-mi",
] as const;

/** İçerikten türetilen detay rotaları. */
export const projectRoutes = projects.map((p) => `/projeler/${p.slug}`);
export const sectorRoutes = sectors.map((s) => `/sektorler/${s.slug}`);
export const systemRoutes = systems.map((s) => `/sistemler/${s.slug}`);

/** Tüm kanonik rotalar, normalize edilmiş ("" yerine "/"). */
export const allCanonicalRoutes: string[] = [
  ...staticRoutes.map((r) => r || "/"),
  ...projectRoutes,
  ...sectorRoutes,
  ...systemRoutes,
];

/**
 * Eski İngilizce rotalar → Türkçe kanonik hedefler (308).
 * Davranış next.config.ts'te tanımlıdır; bu liste denetim/testlerin
 * beklentiyi doğrulaması içindir. İkisini birlikte güncelle.
 */
export const compatRedirects: { source: string; destination: string }[] = [
  { source: "/projects", destination: "/projeler" },
  { source: "/projects/ecommerce-cms", destination: "/projeler/ecommerce-cms" },
  { source: "/services", destination: "/cozumler" },
  { source: "/about", destination: "/hakkimda" },
  { source: "/contact", destination: "/iletisim" },
];

/** Sitemap dışında kalması gereken, 200 dönmesi beklenen metadata rotaları. */
export const metadataRoutes = [
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
] as const;
