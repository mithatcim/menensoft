import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { saveProjectAction } from "@/app/admin/project-actions";
import { ProjectForm, type LocaleValues } from "@/components/admin/project-form";
import {
  FIT_IDS,
  STATUS_LABEL,
  getAdminProject,
  listSlugRedirects,
} from "@/lib/projects-cms/admin";

import type { CmsTranslation, Locale } from "@/lib/projects-cms";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

/** DB row -> form values. Lists become one-per-line; modules become `Ad :: Not`. */
function toLocaleValues(t: CmsTranslation | undefined): LocaleValues {
  return {
    name: t?.name ?? "",
    one_liner: t?.one_liner ?? "",
    problem: t?.problem ?? "",
    status_label: t?.status_label ?? "",
    status_note: t?.status_note ?? "",
    similar_cta: t?.similar_cta ?? "",
    role: t?.role ?? "",
    dossier_summary: t?.dossier_summary ?? "",
    meta_title: t?.meta_title ?? "",
    meta_description: t?.meta_description ?? "",
    og_title: t?.og_title ?? "",
    og_description: t?.og_description ?? "",
    built: (t?.built ?? []).join("\n"),
    flow: (t?.flow ?? []).join("\n"),
    constraints_list: (t?.constraints_list ?? []).join("\n"),
    modules: (t?.modules ?? []).map((m) => `${m.name} :: ${m.note}`).join("\n"),
  };
}

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;

  const row = await getAdminProject(id);

  // null = no database, undefined = no such project. Collapsing the two would
  // say "not found" during an outage and send the owner hunting for a row that
  // is sitting right there.
  if (row === null) {
    return (
      <p className="rounded-xl border border-border bg-card/60 p-6 text-sm text-muted-foreground">
        DATABASE_URL ayarlı değil — proje CMS okunamıyor.
      </p>
    );
  }
  if (!row) notFound();

  const { project, translations, complete } = row;
  const redirects = await listSlugRedirects(project.id);

  const values = {
    id: project.id,
    slug: project.slug,
    status: project.status,
    tier: project.tier,
    fit_id: project.fit_id ?? "",
    featured: project.featured,
    sort_order: project.sort_order,
    stack: (project.stack ?? []).join("\n"),
    year: project.year ?? "",
    live_url: project.live_url ?? "",
    repo_url: project.repo_url ?? "",
    image: project.image ?? "",
    image_alt: project.image_alt ?? "",
    internal_notes: project.internal_notes ?? "",
    tr: toLocaleValues(translations.tr as CmsTranslation | undefined),
    en: toLocaleValues(translations.en as CmsTranslation | undefined),
  };

  const missing = (["tr", "en"] as Locale[]).filter((l) => !complete[l]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Projelere dön
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold tracking-tight">
            {translations.tr?.name || project.slug}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {STATUS_LABEL[project.status]} · {project.slug}
          </p>
        </div>

        <Link
          href={`/admin/projects/${project.id}/preview`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:border-foreground/30"
        >
          <Eye className="size-4" />
          Önizle
        </Link>
      </div>

      {created && (
        <p className="rounded-xl border border-accent/40 bg-accent/5 p-4 text-sm">
          Taslak oluşturuldu. Yayına almadan önce TR ve EN içeriğini tamamlayın.
        </p>
      )}

      {missing.length > 0 && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          {missing.map((l) => l.toUpperCase()).join(" ve ")} çevirisi eksik. Bu
          hâliyle kaydedebilirsiniz, ama yayınlayamazsınız — tek dilli bir proje,
          sitemap’in söz verdiği karşılığı olmayan bir hreflang çifti üretir.
        </p>
      )}

      <ProjectForm
        action={saveProjectAction}
        values={values}
        fitIds={FIT_IDS}
        isNew={false}
        redirects={redirects.map((r) => r.old_slug)}
      />
    </div>
  );
}
