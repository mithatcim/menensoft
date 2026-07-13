import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/**
 * Admin root layout (Phase 33D).
 *
 * A third root layout, alongside (tr) and en/. The admin panel deliberately
 * shares nothing with the public site but the stylesheet: no Header, no Footer,
 * no JSON-LD, no ambient background. It is a tool, not a page.
 *
 * `noindex, nofollow` here covers every admin route through inheritance, and
 * robots.txt disallows /admin as a second layer. Neither is the real protection
 * — the session gate is — but a customer list that is merely unlinked and a
 * customer list that search engines are told to skip are different things.
 */
export const metadata: Metadata = {
  title: "Menensoft — Yönetim",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

/**
 * Never prerendered, never cached. A statically generated admin page would be a
 * public admin page — the whole point is that what it shows depends on who is
 * asking.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background font-sans text-foreground antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
