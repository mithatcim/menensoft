/**
 * Global site identity and shared copy.
 *
 * Phase 9 (2026-07-10): rebranded as Menensoft with Turkish positioning at
 * the site owner's direction. Mithat Yılmaz remains visible as the founder/
 * builder behind the brand. Copy states only owner-confirmed facts; no
 * clients, metrics, testimonials, or launch claims are invented.
 */

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface SiteConfig {
  name: string;
  founder: string;
  role: string;
  positioning: string;
  headline: string;
  subheadline: string;
  availability: string;
  /** Absolute site origin (no trailing slash). Used for metadata/OG/sitemap. */
  siteUrl: string;
  coreStack: string[];

  // Contact channels — a channel only renders when its value is present here.
  email?: string;
  whatsappUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;

  location?: string;
  timezone?: string;
}

/**
 * Absolute deploy origin used for metadataBase, canonical URLs, Open Graph
 * image URLs, sitemap, robots, and every JSON-LD `@id`.
 *
 * The fallback is only a generic local-dev default. It is intentionally the
 * conventional Next port 3000, not this machine's current 3001 (which is only
 * a fallback because another app occupies 3000). No real domain is invented.
 *
 * Forgetting NEXT_PUBLIC_SITE_URL in production is silent — the build succeeds
 * and the site works, it just publishes localhost as its own address. The guard
 * below turns that into a loud build failure, but ONLY on Vercel: `pnpm build`
 * locally also runs with NODE_ENV=production, so keying on NODE_ENV would break
 * `pnpm start` and `pnpm audit:browser`, which rely on the fallback.
 */
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");

/**
 * Is this a build the outside world will see?
 *
 * Vercel sets VERCEL=1 on its platform. SITE_ENV=production is the switch for
 * ANYWHERE ELSE, and it exists because the old guard only knew about Vercel —
 * which meant a production build on a VPS or in Docker would happily publish
 * `http://localhost:3000` as its own address, in every canonical, every sitemap
 * URL and every JSON-LD @id, with a green build and no warning.
 *
 * NODE_ENV cannot be used for this: a local `pnpm build` is also
 * NODE_ENV=production. Non-NEXT_PUBLIC_* vars are never inlined into client
 * bundles, so this stays a server/build-time check and cannot throw in a browser.
 */
const isPublicDeployment =
  Boolean(process.env.VERCEL) || process.env.SITE_ENV === "production";

if (isPublicDeployment && !rawSiteUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is not set. A production build must set it to the " +
      "primary production origin — scheme included, no path, no trailing " +
      "slash (e.g. https://domain.com). Without it, canonical URLs, og:url, " +
      "hreflang, all 60 sitemap entries, robots.txt and every JSON-LD @id " +
      "would publish as http://localhost:3000.\n\n" +
      "On Vercel: Settings → Environment Variables (Production), then redeploy " +
      "WITHOUT build cache — NEXT_PUBLIC_* values are inlined at build time.\n" +
      "Anywhere else: export NEXT_PUBLIC_SITE_URL before `pnpm build`.\n\n" +
      "(This guard fires because VERCEL or SITE_ENV=production is set.)",
  );
}

// A value without a scheme throws deep inside `new URL()` in the root layout,
// which is a confusing way to discover a typo. Fail here with the reason.
if (rawSiteUrl && !/^https?:\/\//.test(rawSiteUrl)) {
  throw new Error(
    `NEXT_PUBLIC_SITE_URL must include the scheme: got "${rawSiteUrl}", ` +
      `expected "https://${rawSiteUrl}".`,
  );
}

export const siteUrl = rawSiteUrl || "http://localhost:3000";

export const site: SiteConfig = {
  name: "Menensoft",
  founder: "Mithat Yılmaz",
  role: "İşletmeler için yazılım sistemleri",
  positioning: "Menensoft — işletmeler için yazılım sistemleri",

  // Hero
  headline: "İşletmeniz için çalışan yazılım sistemleri.",
  subheadline:
    "Web tabanlı admin panelleri, masaüstü uygulamalar, entegrasyonlar, otomasyonlar ve özel iş akışı sistemleri: veritabanından arayüze, çalışır teslim edilen özel yazılım.",

  availability: "Yeni projelere açık",

  siteUrl,

  coreStack: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS"],

  // Real, known contact values:
  email: "mithat.menen@gmail.com",
  githubUrl: "https://github.com/mithatcim",
  whatsappUrl: "https://wa.me/905303115870",
  // linkedinUrl, location, timezone remain omitted until real values exist.
};

export const about = {
  // Phase 9: Menensoft framing; principles/stack philosophy/build-avoid and
  // the tooling line carry over from the owner-approved 8E content, now in
  // Turkish. No biography or claims are invented.
  intro: [
    "Menensoft, işletmelere özel çalışan web sistemleri, masaüstü uygulamalar, entegrasyonlar ve iş akışı otomasyonları geliştiren, kurucusu Mithat Yılmaz liderliğindeki bir yazılım stüdyosudur. Broşür site değil; bir işletmenin sürecini fiilen taşıyan, panelden yönetilen sistemler kurarız.",
    "Yakın dönem işlerimizin çoğu operasyon tarafı olan sistemler: garson, mutfak ve kasa ekranlarıyla çalışan bir restoran sipariş sistemi; kendi yönetim paneline sahip bir psikoloji kliniği web sitesi; görsel sayfa kurucusuyla bir e-ticaret CMS altyapısı. Statik sayfa değil, çalışan sistem teslim etmeyi tercih ederiz.",
    "Kapsamı dürüst tutar, küçük ve gözden geçirilebilir adımlarla ilerler, trend olan yerine güvenilir ve kanıtlanmış teknolojiyi seçeriz. Kurucu Mithat Yılmaz, yazılım geliştirme ve iş süreçlerini ürüne dönüştürme yaklaşımını ekibin üretim disiplinine taşır.",
  ],
  skills: [
    {
      title: "Frontend",
      items: ["TypeScript", "React", "Next.js (App Router)", "Tailwind CSS"],
    },
    {
      title: "Backend",
      items: ["Node.js", "REST API'ler", "Next.js sunucu tarafı", "SQL veritabanları"],
    },
    {
      title: "Araçlar & pratik",
      items: ["Git & GitHub", "pnpm", "ESLint", "Playwright"],
    },
  ] satisfies SkillGroup[],

  principles: [
    "Tek ekran değil, bütün sistemi kur.",
    "Yönetim akışlarını pratik tut.",
    "Veri, arayüz ve operasyonu birbirine oturt.",
    "Şişirilmiş vaat yerine net kapsam.",
    "Küçük, gözden geçirilebilir adımlarla teslim et.",
    "Sürdürülebilirlik ve devir için tasarla.",
  ],

  stackPhilosophy:
    "Bilinçli seçilmiş tek pratik yığın: uçtan uca TypeScript, arayüz ve sunucu tarafı için Next.js, arkada Node.js ve SQL veritabanları, disiplinli arayüz için Tailwind. Trend olan yerine güvenilir, iyi anlaşılmış teknoloji — çünkü çalıştırabildiğiniz sistem, övünülen yığından daha değerlidir.",

  builds: [
    "E-ticaret sistemleri",
    "Yönetim panelleri & dashboard'lar",
    "İş akışı & operasyon araçları",
    "İçerik yönetimli kurumsal siteler",
    "Prototipten ürüne sistem geliştirme",
  ],

  avoids: [
    "Arkasında sistem olmayan ekranlar",
    "Belirsiz kapsam",
    "Uydurma metrikler",
    "Gereksiz karmaşıklık",
    "Trend kovalayan gösteriş",
    "Kullanılabilirliği bozan animasyon",
  ],

  // Tek dürüst araç cümlesi — kimlik değil, iş akışı güçlendirici.
  tooling:
    "Yapay zekâ destekli geliştirme dahil modern araçlar; planlama, geliştirme ve gözden geçirmeyi hızlandırır — her zaman gözden geçirme disipliniyle, asla onun yerine geçmeden.",
};
