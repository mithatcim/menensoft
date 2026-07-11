import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { JsonLd } from "@/components/shared/json-ld";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { siteEn } from "@/content/en/site";
import { site } from "@/content/site";
import {
  graph,
  organizationSchema,
  personSchema,
  websiteSchema,
} from "@/lib/schema";

/**
 * English root layout (/en). A second root layout via route groups so the
 * document language is correct per locale; visual system, fonts and schema
 * are shared with the Turkish layout.
 */

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — ${siteEn.role}`,
    template: `%s — ${site.name}`,
  },
  description: siteEn.subheadline,
  applicationName: site.name,
  authors: [{ name: site.founder }, { name: site.name }],
  creator: site.name,
  alternates: { canonical: "/en" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${siteEn.role}`,
    description: siteEn.subheadline,
    url: "/en",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${siteEn.role}`,
    description: siteEn.subheadline,
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full scroll-smooth antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full">
        <JsonLd
          data={graph(organizationSchema(), personSchema(), websiteSchema())}
        />
        <AmbientBackground />
        <ScrollProgress />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header locale="en" />
          <main className="flex-1">{children}</main>
          <Footer locale="en" />
        </div>
      </body>
    </html>
  );
}
