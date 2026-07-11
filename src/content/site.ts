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
 * image URLs, sitemap, and robots.
 *
 * PRODUCTION MUST set NEXT_PUBLIC_SITE_URL to the real domain at build time —
 * without it, absolute URLs (canonical/OG/sitemap) point at the fallback and
 * social/search tooling will be wrong.
 *
 * The fallback is only a generic local-dev default. It is intentionally the
 * conventional Next port 3000, not this machine's current 3001 (which is only
 * a fallback because another app occupies 3000). No real domain is invented.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const site: SiteConfig = {
  name: "Menensoft",
  founder: "Mithat Yılmaz",
  role: "İşletmeler için çalışan web sistemleri",
  positioning: "Menensoft — işletmeler için çalışan web sistemleri",

  // Hero
  headline: "İşletmeniz için çalışan web sistemleri.",
  subheadline:
    "E-ticaret altyapıları, yönetim panelleri, dashboard'lar ve operasyon sistemleri: veritabanından arayüze, çalışır teslim edilen özel yazılım.",

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
    "Menensoft, işletmeler için çalışan web sistemleri geliştiren bir yazılım markasıdır. Markanın arkasında kurucu ve geliştirici olarak ben, Mithat Yılmaz varım: veri modelinden arayüze, sistemin her katmanını uçtan uca ben tasarlar ve geliştiririm.",
    "Yakın dönem işlerin çoğu, operasyon tarafı olan sistemler: garson, mutfak ve kasa ekranlarıyla çalışan bir restoran sipariş sistemi; kendi yönetim paneline sahip bir psikoloji kliniği web sitesi; görsel sayfa kurucusuyla bir e-ticaret CMS altyapısı. Statik sayfa değil, çalışan sistem teslim etmeyi tercih ederim.",
    "Kapsamı dürüst tutarım, küçük ve gözden geçirilebilir adımlarla ilerlerim, trend olan yerine güvenilir ve kanıtlanmış teknolojiyi seçerim.",
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
