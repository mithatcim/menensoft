import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createProjectAction } from "@/app/admin/project-actions";
import { ProjectForm, type FormValues } from "@/components/admin/project-form";
import { FIT_IDS } from "@/lib/projects-cms/admin";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const EMPTY_LOCALE = {
  name: "",
  one_liner: "",
  problem: "",
  status_label: "",
  status_note: "",
  similar_cta: "",
  role: "",
  dossier_summary: "",
  meta_title: "",
  meta_description: "",
  og_title: "",
  og_description: "",
  built: "",
  flow: "",
  constraints_list: "",
  modules: "",
};

const EMPTY: FormValues = {
  slug: "",
  status: "draft",
  tier: "delivered",
  fit_id: "",
  featured: false,
  sort_order: 0,
  stack: "",
  year: "",
  live_url: "",
  repo_url: "",
  image: "",
  image_alt: "",
  internal_notes: "",
  tr: { ...EMPTY_LOCALE },
  en: { ...EMPTY_LOCALE },
};

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Projelere dön
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight">Yeni proje</h1>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Taslak olarak oluşturulur. Yayınlamak ayrı bir adımdır ve TR + EN
          zorunlu alanları ister.
        </p>
      </div>

      <ProjectForm
        action={createProjectAction}
        values={EMPTY}
        fitIds={FIT_IDS}
        isNew
      />
    </div>
  );
}
