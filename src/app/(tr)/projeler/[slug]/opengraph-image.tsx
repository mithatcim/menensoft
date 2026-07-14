import { site } from "@/content/site";
import {
  getPublishedProject,
  getPublishedSlugs,
} from "@/lib/projects/public";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Proje özeti";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = await getPublishedProject(slug, "tr");
  const project = found?.project;

  if (!project) {
    return renderOgImage({
      eyebrow: site.name,
      title: "Proje",
      footer: site.positioning,
    });
  }

  return renderOgImage({
    eyebrow: project.statusLabel,
    title: project.name,
    subtitle: project.oneLiner,
    footer: site.name,
  });
}
