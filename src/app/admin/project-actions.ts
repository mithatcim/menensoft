"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/admin/auth";
import {
  createProject,
  getAdminProject,
  setProjectStatus,
  slugTaken,
  updateProject,
} from "@/lib/projects-cms/admin";
import { parseProjectForm, publishBlockers } from "@/lib/projects-cms/validate";

/**
 * Project CMS Server Actions (Phase 38B).
 *
 * Every one of them re-checks the session. The (protected) layout already
 * redirects an anonymous visitor away from the pages — but a Server Action is
 * its own POST endpoint and is never routed through that layout. Someone with
 * an action id can call it without ever loading a page. The layout protects what
 * you can SEE; only this protects what you can DO.
 *
 * Since Phase 38C these actions DO revalidate public paths — the public site now
 * reads these rows, so an edit that is not revalidated is an edit nobody will
 * ever see.
 */

async function requireAdmin(): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
}

export interface ProjectFormState {
  errors?: Record<string, string>;
  blockers?: string[];
  message?: string;
  savedAt?: number;
}

function refreshAdmin(id?: string) {
  revalidatePath("/admin/projects");
  if (id) {
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath(`/admin/projects/${id}/preview`);
  }
}

/**
 * Phase 38C: the public site reads these rows now, so an edit that is not
 * revalidated is an edit the owner made and nobody will ever see.
 *
 * Every page that renders project data is refreshed, not just the project's own:
 * the homepage carries featured projects, /cozumler and /en/solutions carry proof
 * chips, the hub and sector/system pages carry related-project rows, and the
 * sitemap carries the route itself. Under-revalidating here produces the worst
 * possible bug — a site that is *partly* updated, where the owner sees the new
 * name on one page and the old one on another and has no idea which is real.
 *
 * The layouts fetch the project index too, so revalidating a layout path covers
 * every page beneath it.
 */
function refreshPublic(slugs: string[]) {
  // The two root layouts feed the client-side project index (proof chips).
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");

  // Sitemap + robots are their own routes.
  revalidatePath("/sitemap.xml");

  for (const slug of slugs.filter(Boolean)) {
    revalidatePath(`/projeler/${slug}`);
    revalidatePath(`/en/projects/${slug}`);
  }
}

/** Create → always a draft. There is no "create published" path, on purpose. */
export async function createProjectAction(
  _prev: ProjectFormState,
  form: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const { ok, errors, input } = parseProjectForm(form);
  if (!ok) return { errors, message: "Kaydedilmedi — alanları kontrol edin." };

  if (await slugTaken(input.slug)) {
    return {
      errors: { slug: "Bu slug zaten kullanılıyor." },
      message: "Kaydedilmedi.",
    };
  }

  let id: string;
  try {
    id = await createProject(input);
  } catch (err) {
    console.error("[projects-cms] create failed:", err);
    return { message: "Kaydedilemedi. Veritabanı yazma hatası." };
  }

  refreshAdmin(id);
  refreshPublic([input.slug]);
  redirect(`/admin/projects/${id}?created=1`);
}

/**
 * Save / publish / archive / restore, chosen by the `intent` the clicked button
 * submits. Publish saves FIRST and then validates what was saved, so the owner
 * can never publish something other than what is on the screen.
 */
export async function saveProjectAction(
  _prev: ProjectFormState,
  form: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  if (!id) return { message: "Proje bulunamadı." };

  const intent = String(form.get("intent") ?? "save");

  // Archive and restore do not touch content, so they must not be blocked by an
  // invalid field somewhere else on the form. Archiving a broken project is
  // exactly what you want to do WITH a broken project.
  if (intent === "archive" || intent === "restore") {
    try {
      await setProjectStatus(id, intent === "archive" ? "archived" : "draft");
    } catch (err) {
      console.error("[projects-cms] status change failed:", err);
      return { message: "Durum değiştirilemedi." };
    }
    refreshAdmin(id);
    // Archiving must take the project OFF the public site and out of the
    // sitemap immediately — that is the whole meaning of the button.
    const archived = await getAdminProject(id);
    refreshPublic(archived ? [archived.project.slug] : []);
    return {
      message:
        intent === "archive"
          ? "Arşivlendi. Yayından kaldırıldı; içerik duruyor."
          : "Taslağa geri alındı.",
      savedAt: Date.now(),
    };
  }

  const { ok, errors, input } = parseProjectForm(form);
  if (!ok) return { errors, message: "Kaydedilmedi — alanları kontrol edin." };

  if (await slugTaken(input.slug, id)) {
    return {
      errors: { slug: "Bu slug başka bir projede kullanılıyor." },
      message: "Kaydedilmedi.",
    };
  }

  // Captured BEFORE the update: if the slug moved, the OLD route is the one
  // holding a stale page, and it is the one nobody would think to refresh.
  const before = await getAdminProject(id);
  const previousSlug = before?.project.slug;

  try {
    await updateProject(id, input);
  } catch (err) {
    // The redirect-shadow trigger raises here. Its message names the slug, which
    // is exactly what the owner needs, but a raw Postgres exception is not
    // something to put on a screen.
    console.error("[projects-cms] update failed:", err);
    return {
      message:
        "Kaydedilemedi. Slug, başka bir projenin eski adresiyle çakışıyor olabilir.",
    };
  }

  if (intent === "publish") {
    const blockers = publishBlockers(input);
    if (blockers.length > 0) {
      refreshAdmin(id);
      refreshPublic([input.slug, previousSlug ?? ""]);
      return {
        blockers,
        message:
          "Kaydedildi ama YAYINLANMADI. Yayın için TR ve EN zorunlu alanları dolu olmalı.",
        savedAt: Date.now(),
      };
    }
    try {
      await setProjectStatus(id, "published");
    } catch (err) {
      console.error("[projects-cms] publish failed:", err);
      return { message: "Kaydedildi ama yayınlanamadı." };
    }
    refreshAdmin(id);
    refreshPublic([input.slug, previousSlug ?? ""]);
    return {
      message: "Yayınlandı. Herkese açık sayfalar ve sitemap güncellendi.",
      savedAt: Date.now(),
    };
  }

  refreshAdmin(id);
  refreshPublic([input.slug, previousSlug ?? ""]);
  return { message: "Kaydedildi.", savedAt: Date.now() };
}

/** Quick archive/unarchive from the list, without opening the editor. */
export async function quickStatusAction(form: FormData): Promise<void> {
  await requireAdmin();

  const id = String(form.get("id") ?? "");
  const next = String(form.get("next") ?? "");
  if (!id || (next !== "archived" && next !== "draft")) return;

  const existing = await getAdminProject(id);
  if (!existing) return;

  await setProjectStatus(id, next);
  refreshAdmin(id);
  refreshPublic([existing.project.slug]);
}
