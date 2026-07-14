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

/**
 * Statik rotalar (typed içerik): 13 static + 6 sektör + 6 sistem = 25 → 50 URL.
 * PROJE rotaları 38C'den beri VERİTABANINDAN gelir, dosyadan değil.
 */
const STATIC_CANONICAL_COUNT = 50;

/** 38C öncesi sabit: 50 + 5 proje × 2 dil = 60. Artık türetiliyor. */
const FALLBACK_CANONICAL_COUNT = 60;

/**
 * Beklenen sitemap sayısı artık YAYINDAKİ proje sayısından türetilir.
 *
 * Sabit 60 iyi bir kilitti ama 38C onu bir yalana çevirdi: sahibi panelden bir
 * proje yayınlarsa sitemap 62 olur ve denetim, doğru bir siteyi "bozuk" diye
 * raporlar — bir süre sonra da kimse ona bakmaz. Bir yandan da proje rotaları
 * SESSİZCE düşerse (boş envanter) bunu yakalamak tam olarak bu denetimin işidir.
 *
 * Bu yüzden sayı DB'den türetilir, ve DB yoksa eski sabite düşülür — ama
 * SITE_ENV=production'da DB'siz denetim bir hatadır, tahmin değil.
 */
async function expectedCanonicalCount() {
  const url = process.env.DATABASE_URL;
  const production = Boolean(process.env.VERCEL) || process.env.SITE_ENV === "production";

  if (!url) {
    if (production) {
      fail(
        "DATABASE_URL yok: üretim modunda proje envanteri doğrulanamaz. " +
          "Sitemap'in proje rotalarını sessizce kaybetmediğini kanıtlayamayız.",
      );
      return FALLBACK_CANONICAL_COUNT;
    }
    console.log(
      `  not: DATABASE_URL yok — proje sayısı doğrulanmadı, ${FALLBACK_CANONICAL_COUNT} varsayıldı`,
    );
    return FALLBACK_CANONICAL_COUNT;
  }

  const { default: pg } = await import("pg");
  const pool = new pg.Pool({
    connectionString: url,
    ssl: /localhost|127.0.0.1/.test(url) ? false : { rejectUnauthorized: true },
  });

  try {
    const { rows } = await pool.query(
      "select count(*)::int as n from projects where status = 'published'",
    );
    const published = rows[0].n;

    if (published === 0) {
      fail(
        "veritabanında YAYINDA HİÇ PROJE YOK — /projeler boş, sitemap 10 URL eksik olur",
      );
    }
    console.log(`  yayındaki proje: ${published} (sitemap'e ${published * 2} URL)`);
    return STATIC_CANONICAL_COUNT + published * 2;
  } finally {
    await pool.end();
  }
}

/** FAQPage şemasının izinli olduğu sayfalar (görünür SSS içeren). */
const FAQ_ROUTES = ["/sss", "/en/faq"];

// İngilizce kelimeli eski yollar → İngilizce kanonik hedefler.
// src/lib/routes.ts (compatRedirects) + next.config.ts ile birlikte güncelle.
const REDIRECTS = [
  ["/projects", "/en/projects"],
  ["/projects/ecommerce-cms", "/en/projects/ecommerce-cms"],
  ["/services", "/en/solutions"],
  ["/about", "/en/about"],
  ["/contact", "/en/contact"],
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

/** Görünür kopyada asla geçmemesi gereken kalıplar (TR + EN). */
const BANNED_TERMS = [
  "mitopasa42",
  "garantisi",
  "ilk sıra",
  "oltalama",
  "phishing",
  "world-class",
  "industry-leading",
  "award-winning",
  "trusted by",
  "guarantee", // "guaranteed" ve "growth guarantee" dahil
  "enterprise support",
  "top-rated",
  "number one",
  "best-in-class",
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

  const expected = await expectedCanonicalCount();
  if (paths.length !== expected)
    fail(`sitemap ${paths.length} URL içeriyor, beklenen ${expected}`);

  // Taslak/arşiv bir proje rotası sitemap'e ASLA giremez.
  const projectPaths = paths.filter((p) =>
    /^\/(projeler|en\/projects)\//.test(p),
  );
  if (projectPaths.length !== expected - STATIC_CANONICAL_COUNT)
    fail(
      `sitemap'te ${projectPaths.length} proje rotası var, beklenen ${expected - STATIC_CANONICAL_COUNT}`,
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

    // hreflang: her kanonik sayfada tr + en alternates olmalı ve
    // gösterilen yollar envanterin içinde kalmalı (karşılıklılık kilidi)
    // Next hrefLang'i camelCase serileştirir; HTML nitelikleri büyük/küçük
    // harfe duyarsızdır — /i ile eşle
    const hreflangs = {};
    for (const m of html.matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/gi,
    ))
      hreflangs[m[1]] = new URL(m[2], BASE).pathname;
    for (const lang of ["tr", "en"]) {
      if (!hreflangs[lang]) fail(`${route}: hreflang ${lang} yok`);
      else if (!paths.includes(hreflangs[lang]))
        fail(
          `${route}: hreflang ${lang} envanter dışını gösteriyor: ${hreflangs[lang]}`,
        );
    }
    const selfLang = route.startsWith("/en") ? "en" : "tr";
    if (hreflangs[selfLang] && hreflangs[selfLang] !== route)
      fail(`${route}: kendi dili hreflang'i kendini göstermiyor`);

    // dil değiştirici: her sayfada TR+EN bağlantısı olmalı, hedefler
    // envanterde kalmalı ve hreflang alternates ile birebir örtüşmeli
    const switchLinks = {};
    for (const m of html.matchAll(/<a\s[^>]*data-lang-switch[^>]*>/g)) {
      const tag = m[0];
      const lang = (tag.match(/data-lang-switch="(tr|en)"/) || [])[1];
      const href = (tag.match(/href="([^"#?]*)"/) || [])[1];
      if (lang && href !== undefined)
        switchLinks[lang] = href.replace(/\/$/, "") || "/";
    }
    for (const lang of ["tr", "en"]) {
      if (!switchLinks[lang]) fail(`${route}: dil değiştirici ${lang} yok`);
      else if (!paths.includes(switchLinks[lang]))
        fail(
          `${route}: değiştirici ${lang} envanter dışı: ${switchLinks[lang]}`,
        );
      else if (hreflangs[lang] && switchLinks[lang] !== hreflangs[lang])
        fail(
          `${route}: değiştirici ${lang} (${switchLinks[lang]}) hreflang ile örtüşmüyor (${hreflangs[lang]})`,
        );
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
        if (types.includes("FAQPage") && !FAQ_ROUTES.includes(route))
          fail(`${route}: FAQPage şeması SSS sayfaları dışında`);
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
