import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProjectCaseStudy } from "@/components/projects/case-study";
import { ScreenshotGallery } from "@/components/projects/screenshot-gallery";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getPublishedProject,
  getPublishedSlugs,
  resolveProjectRedirect,
} from "@/lib/projects/public";
import { graph, projectBreadcrumbSchema, projectSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * A slug missing from generateStaticParams still renders — that is what lets a
 * project published in the panel appear without a redeploy. Anything that is not
 * a published project 404s (or 308s) below.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await getPublishedProject(slug, "tr");
  if (!found) return {};

  const { project, seo } = found;
  return pageMeta({
    // An override wins; otherwise the derived value, exactly as before the
    // cutover. Seeding the overrides with copies of name/oneLiner would have
    // frozen them, and the two would drift apart on the first edit.
    title: seo.metaTitle ?? project.name,
    description: seo.metaDescription ?? project.oneLiner,
    path: `/projeler/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const found = await getPublishedProject(slug, "tr");

  if (!found) {
    // A retired slug must not die: it 308s to the project's current address —
    // but only while that project is still PUBLISHED, so archiving something
    // cannot be undone by a stale link somewhere on the internet.
    const target = await resolveProjectRedirect(slug);
    if (target) permanentRedirect(`/projeler/${target}`);
    notFound();
  }

  const { project } = found;

  return (
    <>
      <JsonLd
        data={graph(projectBreadcrumbSchema(project), projectSchema(project))}
      />
      <ProjectCaseStudy project={project} locale="tr" />
      <ScreenshotGallery slug={project.slug} locale="tr" />
      <ContactCTA />
    </>
  );
}
