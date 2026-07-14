"use client";

import { useActionState, useEffect, useState } from "react";

import type { ProjectFormState } from "@/app/admin/project-actions";
import { cn } from "@/lib/utils";

/**
 * The project editor (Phase 38B).
 *
 * Plain inputs and textareas. No rich text, no block editor, no drag-and-drop —
 * by decision. Lists are one item per line and modules are `Ad :: Not` per line,
 * which is uglier than a repeatable-row widget and considerably harder to break:
 * it works with JavaScript half-loaded, it survives a back button, and it cannot
 * lose the fourth row because a key collided.
 *
 * Errors shown here are a courtesy. The real validation is server-side, in
 * lib/projects-cms/validate.ts, because this form is not the only way to reach
 * the action.
 */

export interface FormValues {
  id?: string;
  slug: string;
  status: string;
  tier: string;
  fit_id: string;
  featured: boolean;
  sort_order: number;
  stack: string;
  year: string;
  live_url: string;
  repo_url: string;
  image: string;
  image_alt: string;
  internal_notes: string;
  tr: LocaleValues;
  en: LocaleValues;
}

export interface LocaleValues {
  name: string;
  one_liner: string;
  problem: string;
  status_label: string;
  status_note: string;
  similar_cta: string;
  role: string;
  dossier_summary: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  built: string;
  flow: string;
  constraints_list: string;
  modules: string;
}

type Action = (
  state: ProjectFormState,
  form: FormData,
) => Promise<ProjectFormState>;

const TABS = [
  { id: "basic", label: "Temel" },
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "English" },
  { id: "seo", label: "SEO" },
  { id: "media", label: "Görsel / Bağlantı" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-foreground/90">
        {label}
      </span>
      {hint && (
        <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
          {hint}
        </span>
      )}
      <span className="mt-1.5 block">{children}</span>
      {error && (
        <span role="alert" className="mt-1 block text-xs text-red-400">
          {error}
        </span>
      )}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-accent/60";

function Text({
  name,
  defaultValue,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      id={name}
      name={name}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={inputCls}
    />
  );
}

function Area({
  name,
  defaultValue,
  rows = 4,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      defaultValue={defaultValue}
      placeholder={placeholder}
      className={cn(inputCls, "resize-y leading-relaxed")}
    />
  );
}

function LocaleFields({
  locale,
  values,
  errors,
}: {
  locale: "tr" | "en";
  values: LocaleValues;
  errors: Record<string, string>;
}) {
  const e = (field: string) => errors[`${locale}_${field}`];

  return (
    <div className="space-y-5">
      <Field label="Başlık *" error={e("name")}>
        <Text name={`${locale}_name`} defaultValue={values.name} />
      </Field>
      <Field
        label="Tek cümle *"
        hint="Kart ve meta açıklaması buradan türer."
        error={e("one_liner")}
      >
        <Area name={`${locale}_one_liner`} defaultValue={values.one_liner} rows={2} />
      </Field>
      <Field label="Problem *" error={e("problem")}>
        <Area name={`${locale}_problem`} defaultValue={values.problem} rows={5} />
      </Field>
      <Field label="Durum etiketi *" error={e("status_label")}>
        <Text name={`${locale}_status_label`} defaultValue={values.status_label} />
      </Field>
      <Field label="Durum notu" error={e("status_note")}>
        <Area name={`${locale}_status_note`} defaultValue={values.status_note} rows={3} />
      </Field>
      <Field label="Rol" error={e("role")}>
        <Text name={`${locale}_role`} defaultValue={values.role} />
      </Field>
      <Field label="“Benzerini istiyorum” CTA" error={e("similar_cta")}>
        <Text name={`${locale}_similar_cta`} defaultValue={values.similar_cta} />
      </Field>
      <Field label="Sistem dosyası özeti" error={e("dossier_summary")}>
        <Area
          name={`${locale}_dossier_summary`}
          defaultValue={values.dossier_summary}
          rows={4}
        />
      </Field>

      <Field label="Neler kuruldu" hint="Her satır bir madde." error={e("built")}>
        <Area name={`${locale}_built`} defaultValue={values.built} rows={5} />
      </Field>
      <Field label="Sistem akışı" hint="Her satır bir aşama." error={e("flow")}>
        <Area name={`${locale}_flow`} defaultValue={values.flow} rows={3} />
      </Field>
      <Field label="Kısıtlar" hint="Her satır bir kısıt." error={e("constraints_list")}>
        <Area
          name={`${locale}_constraints_list`}
          defaultValue={values.constraints_list}
          rows={4}
        />
      </Field>
      <Field
        label="Modüller"
        hint="Her satır: Ad :: Not"
        error={e("modules")}
      >
        <Area
          name={`${locale}_modules`}
          defaultValue={values.modules}
          rows={5}
          placeholder="Yönetim paneli :: Ürünlerin düzenlendiği kontrol ekranları"
        />
      </Field>
    </div>
  );
}

export function ProjectForm({
  action,
  values,
  fitIds,
  isNew,
  redirects = [],
}: {
  action: Action;
  values: FormValues;
  fitIds: string[];
  isNew: boolean;
  redirects?: string[];
}) {
  const [state, formAction, pending] = useActionState<ProjectFormState, FormData>(
    action,
    {},
  );
  const [tab, setTab] = useState<TabId>("basic");
  const [touchedAt, setTouchedAt] = useState(0);

  const errors = state.errors ?? {};

  // Derived, not an effect. A successful save stamps savedAt, so anything typed
  // BEFORE that stamp is no longer unsaved — and a stale "you have unsaved
  // changes" prompt after a successful save is exactly how people learn to
  // click through the prompt without reading it.
  const dirty = touchedAt > (state.savedAt ?? 0);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  // An error on a hidden tab is an error the owner cannot see. Rather than
  // yanking the tab out from under them, mark which tabs hold the problems.
  const errorsPerTab: Record<TabId, number> = {
    basic: 0,
    tr: 0,
    en: 0,
    seo: 0,
    media: 0,
  };
  for (const key of Object.keys(errors)) {
    const seo = /^(tr|en)_(meta|og)_/.test(key);
    if (seo) errorsPerTab.seo++;
    else if (key.startsWith("tr_")) errorsPerTab.tr++;
    else if (key.startsWith("en_")) errorsPerTab.en++;
    else if (key.startsWith("image") || key.endsWith("_url")) errorsPerTab.media++;
    else errorsPerTab.basic++;
  }

  return (
    <form
      action={formAction}
      onInput={() => setTouchedAt(Date.now())}
      className="space-y-6"
    >
      {values.id && <input type="hidden" name="id" value={values.id} />}

      {(state.message || state.blockers) && (
        <div
          role="status"
          className={cn(
            "rounded-xl border p-4 text-sm",
            state.blockers || state.errors
              ? "border-red-500/40 bg-red-500/5 text-red-200"
              : "border-accent/40 bg-accent/5 text-foreground/90",
          )}
        >
          {state.message}
          {state.blockers && (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {state.blockers.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px flex items-center gap-1.5 rounded-t-md border-b-2 px-3 py-2 text-sm transition-colors",
              tab === t.id
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
            {errorsPerTab[t.id] > 0 && (
              <span
                aria-label={`${errorsPerTab[t.id]} hata`}
                className="rounded-full bg-red-500/15 px-1.5 font-mono text-[10px] text-red-300"
              >
                {errorsPerTab[t.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Every tab stays MOUNTED. Unmounting the hidden ones would drop their
          inputs out of the DOM, and an input that is not in the DOM is not in
          the FormData — switching to the SEO tab would silently wipe the English
          content the owner just typed. */}
      <div className={tab === "basic" ? "space-y-5" : "hidden"}>
        <Field
          label="Slug *"
          hint={
            isNew
              ? "Küçük harf, rakam, tire. Yayındaki adres bu."
              : "Slug değişirse eski adres için 308 yönlendirme kaydı oluşturulur (38C’de devreye girecek)."
          }
          error={errors.slug}
        >
          <Text name="slug" defaultValue={values.slug} placeholder="ornek-proje" />
        </Field>

        {redirects.length > 0 && (
          <p className="rounded-lg border border-border bg-card/60 p-3 font-mono text-xs text-muted-foreground">
            Eski adresler: {redirects.join(", ")}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tür *" error={errors.tier}>
            <select name="tier" defaultValue={values.tier} className={inputCls}>
              <option value="delivered">Teslim edilmiş</option>
              <option value="internal">İç / önceki çalışma</option>
            </select>
          </Field>

          <Field
            label="Sistem türü (fit)"
            hint="Sihirbazın eşleştirmesi."
            error={errors.fit_id}
          >
            <select name="fit_id" defaultValue={values.fit_id} className={inputCls}>
              <option value="">—</option>
              {fitIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sıra" hint="Küçük olan önce." error={errors.sort_order}>
            <input
              type="number"
              name="sort_order"
              min={0}
              max={999}
              defaultValue={values.sort_order}
              className={inputCls}
            />
          </Field>

          <Field label="Yıl" error={errors.year}>
            <Text name="year" defaultValue={values.year} placeholder="2025" />
          </Field>
        </div>

        <label className="flex items-center gap-2.5">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={values.featured}
            className="size-4 rounded border-border bg-background"
          />
          <span className="text-sm text-foreground/90">Öne çıkan</span>
        </label>

        <Field label="Stack" hint="Her satır bir teknoloji." error={errors.stack}>
          <Area name="stack" defaultValue={values.stack} rows={4} />
        </Field>

        <Field
          label="İç notlar"
          hint="Yalnızca panelde görünür. Herkese açık sayfaya asla çıkmaz."
          error={errors.internal_notes}
        >
          <Area name="internal_notes" defaultValue={values.internal_notes} rows={3} />
        </Field>
      </div>

      <div className={tab === "tr" ? "" : "hidden"}>
        <LocaleFields locale="tr" values={values.tr} errors={errors} />
      </div>

      <div className={tab === "en" ? "" : "hidden"}>
        <LocaleFields locale="en" values={values.en} errors={errors} />
      </div>

      <div className={tab === "seo" ? "space-y-6" : "hidden"}>
        <p className="rounded-lg border border-border bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">
          Boş bırakılırsa public route şu an <strong>başlık</strong> ve{" "}
          <strong>tek cümle</strong> alanlarından türetilen değerleri kullanıyor.
          Buradaki alanlar veritabanına yazılır ama <strong>38C’de</strong>{" "}
          bağlanacak — bugün doldurmak sayfayı değiştirmez.
        </p>

        {(["tr", "en"] as const).map((locale) => (
          <div key={locale} className="space-y-5">
            <h3 className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
              {locale === "tr" ? "Türkçe" : "English"}
            </h3>
            <Field label="Meta başlık" error={errors[`${locale}_meta_title`]}>
              <Text
                name={`${locale}_meta_title`}
                defaultValue={values[locale].meta_title}
              />
            </Field>
            <Field
              label="Meta açıklama"
              error={errors[`${locale}_meta_description`]}
            >
              <Area
                name={`${locale}_meta_description`}
                defaultValue={values[locale].meta_description}
                rows={2}
              />
            </Field>
            <Field label="OG başlık" error={errors[`${locale}_og_title`]}>
              <Text
                name={`${locale}_og_title`}
                defaultValue={values[locale].og_title}
              />
            </Field>
            <Field label="OG açıklama" error={errors[`${locale}_og_description`]}>
              <Area
                name={`${locale}_og_description`}
                defaultValue={values[locale].og_description}
                rows={2}
              />
            </Field>
          </div>
        ))}
      </div>

      <div className={tab === "media" ? "space-y-5" : "hidden"}>
        <p className="rounded-lg border border-border bg-card/60 p-3 text-xs leading-relaxed text-muted-foreground">
          Yükleme yok — bilinçli. Bugün sitede hiç ekran görüntüsü yok ve
          olmayan bir sorun için depolama seçmek istemiyoruz. Buraya bir yol
          (<code>/gorseller/x.png</code>) ya da tam adres yazabilirsiniz; boşsa
          sayfa dürüst bir <em>rezerve çerçeve</em> gösterir.
        </p>

        <Field label="Görsel yolu / adresi" error={errors.image}>
          <Text name="image" defaultValue={values.image} placeholder="/gorseller/proje.png" />
        </Field>
        <Field
          label="Görsel alt metni"
          hint="Boşsa “<başlık> arayüzü” kullanılır."
          error={errors.image_alt}
        >
          <Text name="image_alt" defaultValue={values.image_alt} />
        </Field>
        <Field label="Canlı adres" error={errors.live_url}>
          <Text name="live_url" defaultValue={values.live_url} placeholder="https://..." />
        </Field>
        <Field label="Repo adresi" error={errors.repo_url}>
          <Text name="repo_url" defaultValue={values.repo_url} placeholder="https://..." />
        </Field>
      </div>

      {/* ------------------------------- publish controls ------------------- */}
      <div className="sticky bottom-0 -mx-5 border-t border-border bg-background/95 px-5 py-4 backdrop-blur">
        {dirty && (
          <p className="mb-3 text-xs text-muted-foreground">
            Kaydedilmemiş değişiklikler var.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            name="intent"
            value="save"
            disabled={pending}
            className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity disabled:opacity-50"
          >
            {pending ? "Kaydediliyor…" : isNew ? "Taslak oluştur" : "Kaydet"}
          </button>

          {!isNew && (
            <>
              <button
                type="submit"
                name="intent"
                value="publish"
                disabled={pending}
                className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/70 disabled:opacity-50"
              >
                Kaydet ve yayınla
              </button>

              {values.status === "archived" ? (
                <button
                  type="submit"
                  name="intent"
                  value="restore"
                  disabled={pending}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Taslağa geri al
                </button>
              ) : (
                <button
                  type="submit"
                  name="intent"
                  value="archive"
                  disabled={pending}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  Arşivle
                </button>
              )}
            </>
          )}
        </div>

        <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
          Yayınlamak için TR <em>ve</em> EN zorunlu alanları dolu olmalı. Kalıcı
          silme yok — arşiv geri alınabilir, silme alınamaz.
        </p>
      </div>
    </form>
  );
}
