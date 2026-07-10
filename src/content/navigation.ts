export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation shown in the header (the CTA renders separately). */
export const mainNav: NavItem[] = [
  { label: "Projeler", href: "/projects" },
  { label: "Çözümler", href: "/services" },
  { label: "Hakkımızda", href: "/about" },
];

/** Header call-to-action. */
export const contactItem: NavItem = { label: "İletişim", href: "/contact" };

/** Full navigation used in the footer and mobile menu. */
export const footerNav: NavItem[] = [...mainNav, contactItem];
