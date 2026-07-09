import { getProject, projects, projectStatusLabel } from "@/content/projects";
import { site } from "@/content/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Project overview";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return renderOgImage({
      eyebrow: site.name,
      title: "Project",
      footer: site.positioning,
    });
  }

  return renderOgImage({
    eyebrow: projectStatusLabel[project.status],
    title: project.name,
    subtitle: project.oneLiner,
    footer: site.name,
  });
}
