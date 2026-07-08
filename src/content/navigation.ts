export interface NavItem {
  label: string;
  href: string;
}

/** Primary navigation shown in the header (contact is rendered as a CTA). */
export const mainNav: NavItem[] = [
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

export const contactItem: NavItem = { label: "Contact", href: "/contact" };

/** Full navigation used in the footer and mobile menu. */
export const footerNav: NavItem[] = [...mainNav, contactItem];
