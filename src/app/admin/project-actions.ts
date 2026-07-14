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
 * Nothing here revalidates a PUBLIC path, and that is deliberate: no public page
 * reads this data yet. Wiring revalidatePath("/projeler") now would be a lie
 * that looks like diligence.
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
    return {
      message:
        "Yayınlandı. (Herkese açık sayfalar 38C'ye kadar hâlâ typed dosyaları okuyor.)",
      savedAt: Date.now(),
    };
  }

  refreshAdmin(id);
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
}
