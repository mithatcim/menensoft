import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { JsonLd } from "@/components/shared/json-ld";
import { ProjectIndexProvider } from "@/components/projects/project-index";
import { getPublishedProjectSummaries } from "@/lib/projects/public";
import { Analytics } from "@/components/analytics/analytics";
import { LanguageHint } from "@/components/shared/language-hint";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { site } from "@/content/site";
import {
  graph,
  organizationSchema,
  personSchema,
  websiteSchema,
} from "@/lib/schema";

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
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: site.subheadline,
  applicationName: site.name,
  authors: [{ name: site.founder }, { name: site.name }],
  creator: site.name,
  alternates: {
    canonical: "/",
    languages: { tr: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.subheadline,
    url: "/",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description: site.subheadline,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetched once per render and handed to client components through context.
  // They need to look projects up by slug for proof chips and cannot query the
  // database themselves — and must not.
  const projects = await getPublishedProjectSummaries("tr");

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full scroll-smooth antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full">
        <JsonLd
          data={graph(organizationSchema(), personSchema(), websiteSchema())}
        />
        <AmbientBackground />
        <ScrollProgress />
        <Analytics locale="tr" />
        <ProjectIndexProvider projects={projects}>
          <div className="relative z-10 flex min-h-screen flex-col">
            <Header />
            <LanguageHint locale="tr" />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ProjectIndexProvider>
      </body>
    </html>
  );
}
