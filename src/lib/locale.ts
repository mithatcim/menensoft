/**
 * İki dilli rota eşlemesi — tek doğruluk kaynağı.
 *
 * Türkçe kanonik rotalar birebir korunur; İngilizce eşdeğerleri /en altında
 * yaşar. Proje slug'ları iki dilde de aynıdır; sektör/sistem slug'ları
 * İngilizcede alıcı-okur dostudur ve buradaki haritalarla eşlenir.
 * Dil değiştirici ve hreflang alternates bu dosyadan beslenir.
 */

export type Locale = "tr" | "en";

/** Statik rota çiftleri: TR yol → EN yol. */
export const staticRoutePairs: Record<string, string> = {
  "": "/en",
  "/projeler": "/en/projects",
  "/cozumler": "/en/solutions",
  "/surec": "/en/process",
  "/teklif-al": "/en/start-project",
  "/sss": "/en/faq",
  "/hakkimda": "/en/about",
  "/iletisim": "/en/contact",
  "/sektorler": "/en/sectors",
  "/sistemler": "/en/systems",
  "/neden-menensoft": "/en/why-menensoft",
  "/hazir-site-mi-ozel-sistem-mi": "/en/custom-system-vs-template",
};

/** Sektör slug eşlemesi: TR → EN. */
export const sectorSlugMap: Record<string, string> = {
  "restoran-qr-siparis-sistemi": "restaurant-qr-ordering-system",
  "psikoloji-klinik-randevu-sistemi": "psychology-clinic-appointment-system",
  "e-ticaret-yonetim-sistemi": "ecommerce-management-system",
  "operasyon-dashboard-sistemi": "operations-dashboard-system",
  "guvenlik-log-yonetimi": "security-log-management",
  "uyelik-platformu": "membership-platform",
};

/** Sistem slug eşlemesi: TR → EN. */
export const systemSlugMap: Record<string, string> = {
  "admin-panel": "admin-panel",
  "e-ticaret-sistemi": "ecommerce-system",
  "dashboard-raporlama": "dashboard-reporting",
  "is-akisi-otomasyonu": "workflow-automation",
  "kurumsal-web-sitesi": "corporate-website",
  "operasyon-sistemi": "operations-system",
};

const sectorSlugMapEnToTr = Object.fromEntries(
  Object.entries(sectorSlugMap).map(([tr, en]) => [en, tr]),
);
const systemSlugMapEnToTr = Object.fromEntries(
  Object.entries(systemSlugMap).map(([tr, en]) => [en, tr]),
);

export function sectorSlugToTr(enSlug: string): string | undefined {
  return sectorSlugMapEnToTr[enSlug];
}
export function systemSlugToTr(enSlug: string): string | undefined {
  return systemSlugMapEnToTr[enSlug];
}

/** TR kanonik yol → EN eşdeğeri (yoksa /en). */
export function enPathFor(trPath: string): string {
  const normalized = trPath === "/" ? "" : trPath.replace(/\/$/, "");
  if (normalized in staticRoutePairs) return staticRoutePairs[normalized];
  const project = normalized.match(/^\/projeler\/(.+)$/);
  if (project) return `/en/projects/${project[1]}`;
  const sector = normalized.match(/^\/sektorler\/(.+)$/);
  if (sector && sectorSlugMap[sector[1]])
    return `/en/sectors/${sectorSlugMap[sector[1]]}`;
  const system = normalized.match(/^\/sistemler\/(.+)$/);
  if (system && systemSlugMap[system[1]])
    return `/en/systems/${systemSlugMap[system[1]]}`;
  return "/en";
}

/** EN kanonik yol → TR eşdeğeri (yoksa /). */
export function trPathFor(enPath: string): string {
  const normalized = enPath.replace(/\/$/, "") || "/en";
  const staticHit = Object.entries(staticRoutePairs).find(
    ([, en]) => en === normalized,
  );
  if (staticHit) return staticHit[0] || "/";
  const project = normalized.match(/^\/en\/projects\/(.+)$/);
  if (project) return `/projeler/${project[1]}`;
  const sector = normalized.match(/^\/en\/sectors\/(.+)$/);
  if (sector && sectorSlugMapEnToTr[sector[1]])
    return `/sektorler/${sectorSlugMapEnToTr[sector[1]]}`;
  const system = normalized.match(/^\/en\/systems\/(.+)$/);
  if (system && systemSlugMapEnToTr[system[1]])
    return `/sistemler/${systemSlugMapEnToTr[system[1]]}`;
  return "/";
}

/** Bulunulan yoldan diğer dilin eşdeğer yolunu verir. */
export function alternatePathFor(path: string): string {
  return path === "/en" || path.startsWith("/en/")
    ? trPathFor(path)
    : enPathFor(path);
}

export function localeOfPath(path: string): Locale {
  return path === "/en" || path.startsWith("/en/") ? "en" : "tr";
}
