import { faq } from "@/content/faq";
import type { Project } from "@/lib/projects/types";
import { solutions } from "@/content/solutions";
import { site, siteUrl } from "@/content/site";

/**
 * JSON-LD builders. Only owner-confirmed facts: no addresses, ratings,
 * reviews, client names, or launch claims. All URLs are absolute and match
 * the canonical Turkish routes.
 */

const ORG_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;
const PERSON_ID = `${siteUrl}/#founder`;

export function organizationSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: site.name,
    description: site.subheadline,
    url: siteUrl,
    email: site.email,
    founder: { "@id": PERSON_ID },
    sameAs: [site.githubUrl].filter(Boolean),
    knowsAbout: [
      "web sistemleri",
      "özel yazılım geliştirme",
      "e-ticaret sistemi",
      "yönetim paneli",
      "dashboard",
      "iş akışı otomasyonu",
      "kurumsal web sitesi",
      "operasyon sistemi",
    ],
  };
}

export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.founder,
    jobTitle: "Kurucu & geliştirici",
    worksFor: { "@id": ORG_ID },
    url: `${siteUrl}/hakkimda`,
    sameAs: [site.githubUrl].filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: siteUrl,
    inLanguage: ["tr", "en"],
    publisher: { "@id": ORG_ID },
  };
}

/** FAQPage — varsayılan Türkçe içerik; /en/faq kendi çevirisini geçirir. */
export function faqSchema(
  items: { question: string; answer: string }[] = faq,
) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function servicesSchema() {
  return solutions.map((solution) => ({
    "@type": "Service",
    name: solution.title,
    description: solution.problem,
    url: `${siteUrl}/cozumler#${solution.id}`,
    provider: { "@id": ORG_ID },
    areaServed: "TR",
  }));
}

/** Genel breadcrumb — iç içe sayfalar (sektör/sistem detayları) için. */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path || "/"}`,
    })),
  };
}

/** Hub sayfaları (/sektorler, /sistemler) için CollectionPage + ItemList. */
export function collectionPageSchema({
  name,
  description,
  path,
  items,
  inLanguage = "tr",
}: {
  name: string;
  description: string;
  path: string;
  items: { name: string; path: string }[];
  inLanguage?: string;
}) {
  return {
    "@type": "CollectionPage",
    name,
    description,
    url: `${siteUrl}${path}`,
    inLanguage,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        url: `${siteUrl}${item.path}`,
      })),
    },
  };
}

/** Tekil hizmet şeması — sektör/sistem detay sayfaları için. */
export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@type": "Service",
    name,
    description,
    url: `${siteUrl}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: "TR",
  };
}

export function projectBreadcrumbSchema(project: Project) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana sayfa", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projeler",
        item: `${siteUrl}/projeler`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: `${siteUrl}/projeler/${project.slug}`,
      },
    ],
  };
}

/**
 * Projeler CreativeWork olarak işaretlenir — SoftwareApplication'ın
 * gerektirdiği mağaza/fiyat alanları burada doğru olmayacağı için
 * bilinçli olarak kullanılmıyor (aşırı iddia yok).
 */
export function projectSchema(
  project: Pick<Project, "name" | "oneLiner" | "slug" | "stack">,
  { path, inLanguage = "tr" }: { path?: string; inLanguage?: string } = {},
) {
  return {
    "@type": "CreativeWork",
    name: project.name,
    description: project.oneLiner,
    url: `${siteUrl}${path ?? `/projeler/${project.slug}`}`,
    inLanguage,
    creator: { "@id": ORG_ID },
    keywords: project.stack.join(", "),
  };
}

/** Bir sayfadaki şemaları tek @graph altında toplar. */
export function graph(...schemas: object[]) {
  return { "@context": "https://schema.org", "@graph": schemas.flat() };
}
