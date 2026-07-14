import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { ProjectCaseStudy } from "@/components/projects/case-study";
import { ContactCTA } from "@/components/shared/contact-cta";
import { JsonLd } from "@/components/shared/json-ld";
import {
  getPublishedProject,
  getPublishedSlugs,
  resolveProjectRedirect,
} from "@/lib/projects/public";
import { breadcrumbSchema, graph, projectSchema } from "@/lib/schema";
import { pageMeta } from "@/lib/seo";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

/** See the Turkish route: a newly published slug must render without a redeploy. */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = await getPublishedProject(slug, "en");
  if (!found) return {};

  const { project, seo } = found;
  return pageMeta({
    title: seo.metaTitle ?? project.name,
    description: seo.metaDescription ?? project.oneLiner,
    path: `/en/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const found = await getPublishedProject(slug, "en");

  if (!found) {
    // A retired slug 308s to its project's current address — but only while that
    // project is still published. See the Turkish route.
    const target = await resolveProjectRedirect(slug);
    if (target) permanentRedirect(`/en/projects/${target}`);
    notFound();
  }

  const { project } = found;

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema([
            { name: "Home", path: "/en" },
            { name: "Projects", path: "/en/projects" },
            { name: project.name, path: `/en/projects/${project.slug}` },
          ]),
          projectSchema(project, {
            path: `/en/projects/${project.slug}`,
            inLanguage: "en",
          }),
        )}
      />
      <ProjectCaseStudy project={project} locale="en" />
      <ContactCTA />
    </>
  );
}
