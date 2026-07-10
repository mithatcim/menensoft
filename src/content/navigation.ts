export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation shown in the header (the CTA renders separately). */
export const mainNav: NavItem[] = [
  { label: "Projeler", href: "/projeler" },
  { label: "Çözümler", href: "/cozumler" },
  { label: "Süreç", href: "/surec" },
  { label: "Hakkında", href: "/hakkimda" },
];

/** Header call-to-action — the primary conversion path. */
export const ctaItem: NavItem = { label: "Teklif al", href: "/teklif-al" };

/** Full navigation used in the footer and mobile menu. */
export const footerNav: NavItem[] = [
  ...mainNav,
  { label: "SSS", href: "/sss" },
  { label: "İletişim", href: "/iletisim" },
  ctaItem,
];
