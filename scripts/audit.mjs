/**
 * Menensoft site denetimi — sıfır bağımlılık (Node 18+ global fetch).
 *
 * Kullanım:
 *   pnpm build && pnpm start   (ya da başka bir portta next start)
 *   BASE=http://localhost:3000 pnpm audit
 *
 * Canlı yayın sonrası aynı script gerçek origin'e karşı çalışır:
 *   BASE=https://<domain> pnpm audit
 *
 * Kontroller:
 * - sitemap.xml URL sayısı === EXPECTED_CANONICAL_COUNT (rota driftine kilit)
 * - sitemap'te İngilizce yönlendirme / metadata rotası / mükerrer yok
 * - her kanonik sayfa 200; tam bir <h1>; başlık+açıklama benzersiz
 * - canonical etiketi rota ile birebir aynı
 * - JSON-LD blokları geçerli JSON; FAQPage yalnızca /sss'te
 * - eski e-posta ve yasaklı iddia kalıpları hiçbir sayfada yok
 * - İngilizce uyumluluk rotaları 308 + doğru hedef
 * - metadata rotaları 200
 * - iç bağlantı taraması: sayfalardaki her dahili href
 *   kanonik ∪ yönlendirme kümesinin içinde (drift/kırık bağlantı kilidi)
 *
 * Rota envanterinin kaynağı src/lib/routes.ts'tir; bu script envanteri
 * çalışan sitenin ürettiği /sitemap.xml üzerinden doğrular. Yeni kanonik
 * sayfa eklerken EXPECTED_CANONICAL_COUNT'u bilinçli olarak artır.
 */

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/+$/, "");

const EXPECTED_CANONICAL_COUNT = 29;

const REDIRECTS = [
  ["/projects", "/projeler"],
  ["/projects/ecommerce-cms", "/projeler/ecommerce-cms"],
  ["/services", "/cozumler"],
  ["/about", "/hakkimda"],
  ["/contact", "/iletisim"],
];

const ENGLISH_PREFIXES = ["/projects", "/services", "/about", "/contact"];

const METADATA_ROUTES = [
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/opengraph-image",
  "/twitter-image",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

/** Görünür kopyada asla geçmemesi gereken kalıplar. */
const BANNED_TERMS = [
  "mitopasa42",
  "garantisi",
  "ilk sıra",
  "oltalama",
  "phishing",
  "world-class",
];

const issues = [];
const notes = [];

function fail(msg) {
  issues.push(msg);
}

async function main() {
  // 1) sitemap envanteri
  const smRes = await fetch(`${BASE}/sitemap.xml`);
  if (smRes.status !== 200) {
    fail(`/sitemap.xml -> ${smRes.status}`);
    return finish();
  }
  const xml = await smRes.text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname,
  );

  if (paths.length !== EXPECTED_CANONICAL_COUNT)
    fail(
      `sitemap ${paths.length} URL içeriyor, beklenen ${EXPECTED_CANONICAL_COUNT}`,
    );
  const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (dupes.length) fail(`sitemap mükerrer: ${dupes.join(", ")}`);
  for (const p of paths) {
    if (ENGLISH_PREFIXES.some((e) => p === e || p.startsWith(e + "/")))
      fail(`İngilizce rota sitemap'te: ${p}`);
    if (METADATA_ROUTES.includes(p)) fail(`metadata rotası sitemap'te: ${p}`);
  }
  notes.push(`sitemap: ${paths.length} URL`);

  // 2) kanonik sayfa kontrolleri
  const titles = new Map();
  const descs = new Map();
  const internalHrefs = new Set();

  for (const route of paths) {
    const res = await fetch(BASE + route, { redirect: "manual" });
    if (res.status !== 200) {
      fail(`${route} -> ${res.status}`);
      continue;
    }
    const html = await res.text();

    const h1Count = (html.match(/<h1[\s>]/g) || []).length;
    if (h1Count !== 1) fail(`${route}: h1 sayısı ${h1Count}`);

    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    if (!title) fail(`${route}: başlık yok`);
    else if (titles.has(title))
      fail(`başlık mükerrer: "${title}" (${route} & ${titles.get(title)})`);
    titles.set(title, route);

    const desc =
      (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] ||
      "";
    if (!desc) fail(`${route}: açıklama yok`);
    else if (descs.has(desc))
      fail(`açıklama mükerrer: ${route} & ${descs.get(desc)}`);
    descs.set(desc, route);

    const canonical =
      (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || "";
    if (!canonical) fail(`${route}: canonical yok`);
    else {
      const canonPath = new URL(canonical, BASE).pathname;
      if (canonPath !== route)
        fail(`${route}: canonical ${canonPath} ile eşleşmiyor`);
    }

    const ldBlocks = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    for (const [, block] of ldBlocks) {
      try {
        const parsed = JSON.parse(block);
        const types = (parsed["@graph"] || [parsed]).map((x) => x["@type"]);
        if (types.includes("FAQPage") && route !== "/sss")
          fail(`${route}: FAQPage şeması /sss dışında`);
        if (
          types.some((t) =>
            ["Review", "AggregateRating", "Offer"].includes(t),
          )
        )
          fail(`${route}: review/rating/offer şeması var`);
      } catch {
        fail(`${route}: JSON-LD parse edilemiyor`);
      }
    }

    const lower = html.toLowerCase();
    for (const term of BANNED_TERMS)
      if (lower.includes(term)) fail(`${route}: yasaklı kalıp "${term}"`);

    // yalnızca <a> bağlantıları — <link> etiketleri ve /_next varlıkları hariç
    for (const m of html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)/g)) {
      const href = m[1].replace(/\/$/, "") || "/";
      if (!href.startsWith("/_next/")) internalHrefs.add(href);
    }
  }

  // 3) iç bağlantı kapanışı: her dahili href bilinen bir rotaya gitmeli
  const known = new Set([
    ...paths,
    ...REDIRECTS.map(([from]) => from),
  ]);
  for (const href of internalHrefs) {
    if (known.has(href)) continue;
    const res = await fetch(BASE + href, { redirect: "manual" });
    if (![200, 308].includes(res.status))
      fail(`iç bağlantı kırık: ${href} -> ${res.status}`);
    else fail(`envanter dışı iç bağlantı (drift?): ${href}`);
  }
  notes.push(`iç bağlantı: ${internalHrefs.size} benzersiz href tarandı`);

  // 4) yönlendirmeler
  for (const [from, to] of REDIRECTS) {
    const res = await fetch(BASE + from, { redirect: "manual" });
    const loc = res.headers.get("location") || "";
    if (res.status !== 308 || !loc.endsWith(to))
      fail(`yönlendirme ${from} -> ${res.status} ${loc}`);
  }
  notes.push(`yönlendirme: ${REDIRECTS.length} kontrol edildi`);

  // 5) metadata rotaları + 404
  for (const route of METADATA_ROUTES) {
    const res = await fetch(BASE + route);
    if (res.status !== 200) fail(`${route} -> ${res.status}`);
  }
  const nf = await fetch(`${BASE}/phase12a-not-real-page`);
  if (nf.status !== 404) fail(`/phase12a-not-real-page -> ${nf.status}`);
  notes.push(`metadata: ${METADATA_ROUTES.length} rota kontrol edildi`);

  finish();
}

function finish() {
  console.log(`BASE = ${BASE}`);
  notes.forEach((n) => console.log("  " + n));
  if (issues.length) {
    console.error(`\nSORUNLAR (${issues.length}):`);
    issues.forEach((i) => console.error("  FAIL " + i));
    process.exit(2);
  }
  console.log("\nTÜM KONTROLLER TEMİZ");
}

main().catch((e) => {
  console.error("Denetim çalıştırılamadı:", e.message);
  console.error(
    "Sunucu ayakta mı? Önce `pnpm build && pnpm start` (ya da BASE ile başka origin) gerekir.",
  );
  process.exit(1);
});
