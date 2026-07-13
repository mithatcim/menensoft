import { projects } from "@/content/projects";
import { sectors } from "@/content/sectors";
import { systems } from "@/content/systems";
import { enPathFor } from "@/lib/locale";

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
  "/gizlilik",
] as const;

/** İçerikten türetilen detay rotaları. */
export const projectRoutes = projects.map((p) => `/projeler/${p.slug}`);
export const sectorRoutes = sectors.map((s) => `/sektorler/${s.slug}`);
export const systemRoutes = systems.map((s) => `/sistemler/${s.slug}`);

/** Türkçe kanonik rotalar, normalize edilmiş ("" yerine "/"). */
export const trCanonicalRoutes: string[] = [
  ...staticRoutes.map((r) => r || "/"),
  ...projectRoutes,
  ...sectorRoutes,
  ...systemRoutes,
];

/** İngilizce kanonik rotalar — TR envanterinden locale haritasıyla türetilir. */
export const enCanonicalRoutes: string[] = trCanonicalRoutes.map(enPathFor);

/** İki dilin tüm kanonik rotaları (58). */
export const allCanonicalRoutes: string[] = [
  ...trCanonicalRoutes,
  ...enCanonicalRoutes,
];

/**
 * İngilizce kelimeli eski yollar → İngilizce kanonik hedefler (308).
 * Davranış next.config.ts'te tanımlıdır; bu liste denetim/testlerin
 * beklentiyi doğrulaması içindir. İkisini birlikte güncelle.
 */
export const compatRedirects: { source: string; destination: string }[] = [
  { source: "/projects", destination: "/en/projects" },
  {
    source: "/projects/ecommerce-cms",
    destination: "/en/projects/ecommerce-cms",
  },
  { source: "/services", destination: "/en/solutions" },
  { source: "/about", destination: "/en/about" },
  { source: "/contact", destination: "/en/contact" },
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
