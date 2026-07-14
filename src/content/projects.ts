/**
 * Proje içerikleri.
 *
 * Phase 9 (2026-07-10): site sahibinin talimatıyla Türkçeye çevrildi ve
 * projeler "tamamlanmış / çalışır teslim" konumlandırmasıyla güncellendi.
 * Müşteri adı, gelir, kullanıcı sayısı, canlı URL veya lansman durumu gibi
 * doğrulanamayan hiçbir iddia eklenmez; kesin olmayan her şey genel ifadeyle
 * kalır ("çalışır sistem", "teslim edilmiş çalışma").
 */

import type { Project } from "@/lib/projects/types";

/**
 * Phase 38C: the SHAPE now lives in src/lib/projects/types.ts, because the
 * CONTENT now lives in PostgreSQL. This file is the rollback reference and the
 * seed source for `pnpm cms:seed` — the public site no longer reads it.
 */
export type { Project, ProjectTier } from "@/lib/projects/types";
export { projectImage } from "@/lib/projects/types";

export const projects: Project[] = [
  {
    slug: "ecommerce-cms",
    name: "E-Ticaret CMS & Görsel Site Kurucu",
    oneLiner:
      "Mağaza sayfalarının kodla değil, görsel olarak kurulduğu içerik yönetimli e-ticaret sistemi.",
    problem:
      "Online mağaza işletmek çoğu zaman bir mağaza sistemi ile ayrı bir site kurucuyu birlikte idare etmek demektir. Bu sistem ikisini birleştirir: ürünleri yöneten panel, onları satan sayfaları da yönetir.",
    built: [
      "Ürün ve kategori yönetimi",
      "Ürün ve kategori sayfalarıyla vitrin",
      "Ürün düzenleme için yönetim paneli",
      "Vitrin içerikleri için görsel sayfa kurucu",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    tier: "delivered",
    statusLabel: "Tamamlanmış ürün altyapısı",
    featured: true,
    role: "Uçtan uca tasarlandı ve geliştirildi",
    statusNote:
      "Tamamlanmış ürün altyapısı: yönetim paneli, vitrin ve görsel sayfa kurucu birlikte çalışır durumda. Ekran görüntüleri ve mimari notlar eklenecek.",
    similarCta: "Benzer bir e-ticaret altyapısı istiyorum",
    flow: ["Yönetim & CMS", "Görsel sayfa kurucu", "Vitrin"],
    dossierSummary:
      "Ürünleri yöneten panelin, onları satan sayfaları da yönettiği tek sistem. Yönetim paneli, görsel sayfa kurucu ve vitrin birlikte çalışır durumda; üretime hazır ürün altyapısı olarak tamamlandı.",
    constraints: [
      "Ticaret ve içerik için tek yönetim yüzeyi",
      "Mağaza sayfaları kodla değil, görsel olarak kurulmalı",
      "Ürün verisi ve sayfa içeriği panel ile vitrin arasında tutarlı kalmalı",
    ],
    modules: [
      {
        name: "Ürün & kategori yönetimi",
        note: "Ticaretin veri çekirdeği: ürünler, kategoriler ve ilişkileri",
      },
      {
        name: "Yönetim paneli",
        note: "Ürünlerin ve içeriklerin düzenlendiği kontrol ekranları",
      },
      {
        name: "Görsel sayfa kurucu",
        note: "Vitrin sayfaları, yönetilen içerikten görsel olarak kurulur",
      },
      {
        name: "Vitrin",
        note: "Müşteriye açık ürün ve kategori sayfaları",
      },
    ],
  },
  {
    slug: "restaurant-qr-system",
    name: "Restoran QR Menü & Operasyon Sistemi",
    oneLiner:
      "Garson, mutfak ve kasa ekranlarına bağlı QR kodlu menü ve sipariş sistemi.",
    problem:
      "Sözlü alınan siparişler masa, mutfak ve kasa arasında kaybolur. Bu sistemde sipariş bir kez, masada alınır ve ihtiyaç duyan her role çalışır şekilde akar.",
    built: [
      "Misafirin masada açtığı QR menü",
      "Masa siparişlerini yöneten garson ekranı",
      "Gelen siparişler için mutfak ekranı",
      "Hesap kapatma için kasa akışı",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "delivered",
    statusLabel: "Tamamlanmış operasyon sistemi",
    featured: true,
    role: "Uçtan uca tasarlandı ve geliştirildi",
    statusNote:
      "Tamamlanmış operasyon sistemi: sipariş, QR menüden garson, mutfak ve kasa ekranlarına çalışır şekilde akar. Çalışır teslim edilmiş yapı.",
    similarCta: "Benzer bir operasyon sistemi konuşalım",
    flow: ["QR menü", "Garson ekranı", "Mutfak ekranı", "Kasa"],
    dossierSummary:
      "Tamamlanmış full-stack operasyon sistemi: sipariş masada bir kez alınır ve garson, mutfak, kasa — ihtiyacı olan her role — hafızaya değil sisteme dayanarak ulaşır.",
    constraints: [
      "Kaynağında bir kez alınan sipariş üç farklı role ulaşmalı",
      "Her istasyonun kendi işine uygun kendi ekranı olmalı",
      "Misafir kendi telefonundan QR ile sipariş verebilmeli",
    ],
    modules: [
      {
        name: "QR menü",
        note: "Misafirin masada açıp sipariş verdiği menü arayüzü",
      },
      {
        name: "Garson ekranı",
        note: "Masa siparişlerinin yönetildiği operasyon ekranı",
      },
      {
        name: "Mutfak ekranı",
        note: "Gelen siparişlerin sırayla aktığı hazırlık ekranı",
      },
      {
        name: "Kasa akışı",
        note: "Hesapların kapatıldığı tahsilat adımı",
      },
    ],
  },
  {
    slug: "orva-psychology",
    name: "Orva Psikoloji — Web Sitesi & Yönetim Paneli",
    oneLiner:
      "Bir psikoloji kliniği için web sitesi ve içerik yönetimi sağlayan yönetim paneli.",
    problem:
      "Bir klinik sitesi, ancak kliniği yürüten kişiler onu koda dokunmadan güncelleyebiliyorsa işe yarar.",
    built: [
      "Ziyaretçiye açık klinik web sitesi",
      "Site içeriğini yöneten yönetim paneli",
      "Randevu talebi akışı",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "delivered",
    statusLabel: "Tamamlanmış kurumsal site + panel",
    featured: true,
    role: "Uçtan uca tasarlandı ve geliştirildi",
    statusNote:
      "Tamamlanmış kurumsal site + panel: içerik yönetimi ve randevu talebi akışıyla, müşteri ihtiyacına göre tamamlanmış ve teslim edilmiş çalışma.",
    similarCta: "Bu yapıya yakın bir site + panel istiyorum",
    flow: ["Yönetim paneli", "İçerik yönetimi", "Kurumsal site"],
    dossierSummary:
      "Bir psikoloji kliniği için tamamlanmış site + panel ikilisi: kurumsal site kliniği anlatır, panel ise kliniği yürütenlerin içerikleri ve randevu taleplerini koda dokunmadan yönetmesini sağlar.",
    constraints: [
      "Teknik olmayan ekip siteyi kendisi güncelleyebilmeli",
      "Kurumsal site ve içerikleri tek panelden yönetilmeli",
      "Randevu talepleri posta kutusu değil, akış olarak ele alınmalı",
    ],
    modules: [
      {
        name: "Kurumsal klinik sitesi",
        note: "Kliniğin ziyaretçiye açık yüzü",
      },
      {
        name: "Yönetim paneli",
        note: "İçeriklerin koda dokunmadan yönetildiği ekranlar",
      },
      {
        name: "Randevu talebi akışı",
        note: "Taleplerin panelde toplandığı ve ele alındığı akış",
      },
    ],
  },
  {
    slug: "log-management-platform",
    name: "Güvenlik Log Yönetim Platformu",
    oneLiner:
      "Güvenlik olay kayıtlarını tek yerde toplayan, saklayan ve incelemeye açan platform.",
    problem:
      "Sistemlere dağılmış güvenlik logları, olay anında işe yaramaz. Merkezileştirmek; saklama ve incelemeyi arkeoloji değil, iş akışı haline getirir.",
    built: [
      "Merkezî log toplama ve saklama",
      "Log kayıtlarında arama ve inceleme arayüzü",
    ],
    stack: ["TypeScript", "Node.js"],
    tier: "internal",
    statusLabel: "İç ürün altyapısı — çalışır modüller",
    featured: false,
    role: "Uçtan uca tasarlandı ve geliştirildi",
    statusNote:
      "İç ürün altyapısı: log toplama, saklama ve inceleme modülleri çalışır durumda. Sertleştirme ve uyumluluk çalışmaları bilinçli olarak bu kapsamın dışında tutuldu.",
    similarCta: "Benzer bir raporlama sistemi konuşalım",
    flow: ["Log toplama", "Saklama", "Arama & inceleme"],
    dossierSummary:
      "Merkezî güvenlik log yönetimi için geliştirilmiş iç ürün altyapısı: toplama, saklama ve inceleme arayüzü tek yerde, çalışır modüller halinde.",
    constraints: [
      "Log saklama ve incelemeyi arkeoloji değil, iş akışı haline getirmek",
    ],
    modules: [
      {
        name: "Merkezî toplama & saklama",
        note: "Güvenlik olay kayıtları tek yerde toplanır",
      },
      {
        name: "Arama & inceleme arayüzü",
        note: "Kayıtların bulunup okunduğu ekranlar",
      },
    ],
  },
  {
    slug: "cendovar",
    name: "Cendovar — Üyelik & Sinyal Platformu",
    oneLiner:
      "Abone üyelere bildirim tarzı sinyal kayıtları yayınlayan üyelik platformu.",
    problem:
      "Üyelere özel içerik sunmak; bantla tutturulmuş bir e-posta listesi değil, gerçek hesap, erişim ve yayınlama mekanikleri gerektirir.",
    built: [
      "Üyelik hesapları ve abonelik yönetimi",
      "Abone üyelere sinyal kayıtları yayınlama",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    tier: "internal",
    statusLabel: "Önceki ürün çalışması — tamamlanmış altyapı",
    featured: false,
    role: "Uçtan uca tasarlandı ve geliştirildi",
    statusNote:
      "Önceki ürün çalışması: üyelik, erişim ve yayınlama altyapısı tamamlanmış ve çalışır durumda.",
    similarCta: "Benzer bir üyelik/otomasyon akışı istiyorum",
    flow: ["Üyelik & erişim", "Yayınlama", "Üyeye iletim"],
    dossierSummary:
      "Tamamlanmış üyelik/sinyal platformu çalışması: hesaplar, erişim kontrolü ve üyelere bildirim tarzı sinyal kayıtları yayınlama altyapısı çalışır halde.",
    constraints: [
      "Üyelere özel içerik için gerçek hesap, erişim ve yayınlama mekanikleri",
    ],
    modules: [
      {
        name: "Üyelik & abonelik yönetimi",
        note: "Kimin neye erişebileceğini belirleyen hesap katmanı",
      },
      {
        name: "Sinyal yayınlama",
        note: "Bildirim tarzı kayıtların üyelere iletilmesi",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

