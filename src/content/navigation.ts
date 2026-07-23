export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation shown in the header (the CTA renders separately). */
export const mainNav: NavItem[] = [
  { label: "Çözümler", href: "/cozumler" },
  // Ziyaretçi denetimi: teknik olmayan alıcı kendini en kolay sektöründen
  // bulur; footer'da gömülüyken keşfedilmiyordu.
  { label: "Sektörler", href: "/sektorler" },
  { label: "Projeler", href: "/projeler" },
  { label: "Süreç", href: "/surec" },
  { label: "Hakkımızda", href: "/hakkimda" },
  { label: "SSS", href: "/sss" },
];

/**
 * Header call-to-action — the general front door.
 *
 * "İletişim", not "Proje görüşmesi": the nav primary is the one button every
 * visitor sees on every page, including the ones who just want to ask a
 * question, and it should not force everyone through a guided brief to do that.
 * The contact page carries all three channels (e-posta, WhatsApp, brief), so
 * nothing is lost — the inquiry studio is one of the doors it opens.
 *
 * Contextual CTAs are untouched: "Bu sistemi konuşalım", "Proje görüşmesi
 * başlat" and every hub/project CTA still go to /teklif-al with their ?tur=
 * and ?proje= prefills intact. Those know what the visitor is looking at; the
 * nav does not.
 */
export const ctaItem: NavItem = {
  label: "İletişim",
  href: "/iletisim",
};

/** The guided brief. Not the nav primary any more, so the footer keeps it
 *  reachable from every page — a page nobody can find is a page nobody uses. */
export const inquiryItem: NavItem = {
  label: "Proje görüşmesi",
  href: "/teklif-al",
};

/**
 * Full navigation used in the footer and mobile menu. Hub pages
 * (Sistemler/Sektörler) live here, not in the header, to keep the
 * header uncrowded.
 */
export const footerNav: NavItem[] = [
  { label: "Çözümler", href: "/cozumler" },
  { label: "Sistemler", href: "/sistemler" },
  { label: "Sektörler", href: "/sektorler" },
  { label: "Projeler", href: "/projeler" },
  { label: "Süreç", href: "/surec" },
  { label: "Hakkımızda", href: "/hakkimda" },
  { label: "SSS", href: "/sss" },
  { label: "İletişim", href: "/iletisim" },
  inquiryItem,
];

/* --------------------------- English navigation --------------------------- */

export const mainNavEn: NavItem[] = [
  { label: "Solutions", href: "/en/solutions" },
  { label: "Sectors", href: "/en/sectors" },
  { label: "Projects", href: "/en/projects" },
  { label: "Process", href: "/en/process" },
  { label: "About", href: "/en/about" },
  { label: "FAQ", href: "/en/faq" },
];

export const ctaItemEn: NavItem = {
  label: "Contact",
  href: "/en/contact",
};

export const inquiryItemEn: NavItem = {
  label: "Start a project",
  href: "/en/start-project",
};

export const footerNavEn: NavItem[] = [
  { label: "Solutions", href: "/en/solutions" },
  { label: "Systems", href: "/en/systems" },
  { label: "Sectors", href: "/en/sectors" },
  { label: "Projects", href: "/en/projects" },
  { label: "Process", href: "/en/process" },
  { label: "About", href: "/en/about" },
  { label: "FAQ", href: "/en/faq" },
  { label: "Contact", href: "/en/contact" },
  inquiryItemEn,
];
