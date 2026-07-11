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

/** Header call-to-action — the primary conversion path. */
export const ctaItem: NavItem = { label: "Teklif al", href: "/teklif-al" };

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
