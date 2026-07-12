export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation shown in the header (the CTA renders separately). */
export const mainNav: NavItem[] = [
  { label: "Çözümler", href: "/cozumler" },
  { label: "Projeler", href: "/projeler" },
  { label: "Süreç", href: "/surec" },
  { label: "Hakkında", href: "/hakkimda" },
  { label: "SSS", href: "/sss" },
];

/**
 * Header call-to-action — the primary conversion path.
 *
 * The label is "Proje görüşmesi", not "Teklif al": the page behind it
 * deliberately refuses to quote a price before the scope is clear, so a button
 * promising a quote set an expectation the page then had to walk back. The
 * route keeps /teklif-al — only the visible wording changed.
 */
export const ctaItem: NavItem = {
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
  { label: "Hakkında", href: "/hakkimda" },
  { label: "SSS", href: "/sss" },
  { label: "İletişim", href: "/iletisim" },
  ctaItem,
];

/* --------------------------- English navigation --------------------------- */

export const mainNavEn: NavItem[] = [
  { label: "Solutions", href: "/en/solutions" },
  { label: "Projects", href: "/en/projects" },
  { label: "Process", href: "/en/process" },
  { label: "About", href: "/en/about" },
  { label: "FAQ", href: "/en/faq" },
];

export const ctaItemEn: NavItem = {
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
  ctaItemEn,
];
