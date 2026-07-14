import { Container } from "@/components/layout/container";
import { CaseStudyHero } from "@/components/projects/case-study-hero";
import { SimilarSystemBand } from "@/components/projects/similar-system-band";
import {
  DossierConstraints,
  DossierModules,
  isCompactDossier,
} from "@/components/projects/system-dossier";
import { CapabilityMatrix } from "@/components/projects/system-map";
import {
  TeardownRail,
  type TeardownStage,
} from "@/components/projects/teardown-rail";
import {
  BrowserFrame,
  ReservedCaptureStrip,
} from "@/components/shared/browser-frame";
import { FlowPanel } from "@/components/shared/flow-panel";
import { Reveal } from "@/components/shared/reveal";
import { type Locale } from "@/lib/locale";
import { hasCapabilities } from "@/lib/projects/capabilities";
import { projectImage, type PublicProject } from "@/lib/projects/types";

/**
 * The project case study — the body of /projeler/[slug] and /en/projects/[slug].
 *
 * Extracted in Phase 38D. It was the same markup twice, in two files, differing
 * only in copy: any change to a project page had to be made in both, and the day
 * someone made it in one, the two languages would have quietly drifted apart.
 *
 * It also gives the admin preview something it could not have before — the ACTUAL
 * page. Preview renders this component with draft data, so what the owner sees
 * before publishing is the thing that publishes.
 *
 * Note what is NOT here: no data fetching, no draft handling, no auth. It takes a
 * project and renders it. The public route hands it a PUBLISHED project; the
 * admin preview hands it a draft. Keeping the draft path out of the public route
 * entirely is why a draft cannot leak from it — there is no code path to leak
 * through.
 */

const COPY = {
  tr: {
    stages: [
      { id: "input", num: "01", label: "Girdi", sub: "Kısıtlar" },
      { id: "architecture", num: "02", label: "Mimari", sub: "Sistem akışı" },
      { id: "interface", num: "03", label: "Arayüz", sub: "Neler kuruldu" },
      { id: "scope", num: "04", label: "Kapsam", sub: "Güncel durum" },
    ] as TeardownStage[],
    inputChip: "Girdi — kısıtlar",
    inputHeading: "Kısıtlar ve tasarım kararları",
    inputLead:
      "Kapsam bu kısıtlara göre çizildi; sistemin şeklini belirleyen kararlar bunlar.",
    archChip: "Mimari — sistem akışı",
    archHeading: "Sistem akışı",
    interfaceChip: "Arayüz — neler kuruldu",
    interfaceHeading: "Neler kuruldu",
    scopeChip: "Kapsam — güncel durum",
    scopeHeading: "Kapsam ve güncel durum",
    statusLabel: "Güncel durum & kapsam",
    statusFallback: (label: string) =>
      `${label}. Detaylar proje olgunlaştıkça eklenir.`,
  },
  en: {
    stages: [
      { id: "input", num: "01", label: "Input", sub: "Constraints" },
      { id: "architecture", num: "02", label: "Architecture", sub: "System flow" },
      { id: "interface", num: "03", label: "Interface", sub: "What was built" },
      { id: "scope", num: "04", label: "Scope", sub: "Current status" },
    ] as TeardownStage[],
    inputChip: "Input — constraints",
    inputHeading: "Constraints and design decisions",
    inputLead:
      "The scope was drawn against these constraints — they are the decisions that gave the system its shape.",
    archChip: "Architecture — system flow",
    archHeading: "System flow",
    interfaceChip: "Interface — what was built",
    interfaceHeading: "What was built",
    scopeChip: "Scope — current status",
    scopeHeading: "Scope and current status",
    statusLabel: "Current status & scope",
    statusFallback: (label: string) =>
      `${label}. Details get added as the project matures.`,
  },
} as const;

function StageChip({ num, label }: { num: string; label: string }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-xs tracking-widest text-muted-foreground uppercase">
      <span className="flex size-6 items-center justify-center rounded-md border border-accent/30 bg-accent/5 text-accent">
        {num}
      </span>
      {label}
    </p>
  );
}

/** Every teardown stage owns a real h2 — the outline was h1 → one h2 before. */
function StageHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 text-xl font-semibold tracking-tight">{children}</h2>
  );
}

export function ProjectCaseStudy({
  project,
  locale = "tr",
}: {
  project: PublicProject;
  locale?: Locale;
}) {
  const copy = COPY[locale];
  const capture = projectImage(project);

  return (
    <>
      <CaseStudyHero project={project} locale={locale} />

      <section className="py-14 md:py-20">
        <Container>
          <article className="max-w-3xl xl:max-w-[62rem]">
            <div className="xl:grid xl:grid-cols-[180px_minmax(0,1fr)] xl:gap-12">
              <div className="hidden xl:block">
                <div className="sticky top-28">
                  <TeardownRail stages={copy.stages} />
                </div>
              </div>

              <div className="max-w-3xl space-y-14">
                <Reveal>
                  <section
                    id="teardown-input"
                    data-teardown="input"
                    className="scroll-mt-28"
                  >
                    <StageChip num="01" label={copy.inputChip} />
                    <StageHeading>{copy.inputHeading}</StageHeading>
                    <p className="mt-3 mb-5 leading-relaxed text-muted-foreground">
                      {copy.inputLead}
                    </p>
                    <DossierConstraints
                      project={project}
                      locale={locale}
                      showLabel={false}
                    />
                  </section>
                </Reveal>

                {project.flow && (
                  <Reveal delay={0.04}>
                    <section
                      id="teardown-architecture"
                      data-teardown="architecture"
                      className="scroll-mt-28"
                    >
                      {/* no FlowPanel label: the stage chip and the h2 above
                          already say "system flow" — it read three times */}
                      <StageChip num="02" label={copy.archChip} />
                      <StageHeading>{copy.archHeading}</StageHeading>
                      <FlowPanel nodes={project.flow} className="mt-4" />
                    </section>
                  </Reveal>
                )}

                <Reveal delay={0.04}>
                  <section
                    id="teardown-interface"
                    data-teardown="interface"
                    className="scroll-mt-28"
                  >
                    <StageChip num="03" label={copy.interfaceChip} />
                    <StageHeading>{copy.interfaceHeading}</StageHeading>

                    {/* The real modules lead. Until interface captures exist,
                        the built structure IS the proof — so it gets the visual
                        weight, and the reserved capture sits under it as a slim
                        strip instead of a 530px empty frame above it. */}
                    {project.modules ? (
                      <div className="mt-4">
                        <DossierModules project={project} />
                      </div>
                    ) : (
                      <div className="mt-4 overflow-hidden rounded-xl border border-border">
                        <ul className="divide-y divide-border/60">
                          {project.built.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-3 bg-card px-5 py-3.5 text-sm leading-relaxed text-muted-foreground"
                            >
                              <span
                                aria-hidden
                                className="size-1.5 shrink-0 bg-accent/80"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4">
                      {capture ? (
                        <BrowserFrame title={`/${project.slug}`} image={capture} />
                      ) : (
                        <ReservedCaptureStrip />
                      )}
                    </div>
                  </section>
                </Reveal>

                <Reveal delay={0.04}>
                  <section
                    id="teardown-scope"
                    data-teardown="scope"
                    className="scroll-mt-28"
                  >
                    <StageChip num="04" label={copy.scopeChip} />
                    <StageHeading>{copy.scopeHeading}</StageHeading>
                    {/* The wrapper is conditional too. 38D made the matrix return
                        null for an unmapped project but left this bordered box
                        around it — so a panel-created project rendered an empty
                        framed rectangle. A box with nothing in it still says
                        something. */}
                    {hasCapabilities(project) && (
                      <div className="mt-4 rounded-xl border border-border bg-background/40 p-4">
                        <CapabilityMatrix
                          capabilities={project.capabilities}
                          quiet={isCompactDossier(project)}
                          locale={locale}
                        />
                      </div>
                    )}
                    <div className="mt-4 rounded-xl border border-border bg-card p-6">
                      <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/90"
                        />
                        {copy.statusLabel}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {project.statusNote ??
                          copy.statusFallback(project.statusLabel)}
                      </p>
                    </div>
                  </section>
                </Reveal>
              </div>
            </div>
          </article>
        </Container>
      </section>

      <SimilarSystemBand project={project} locale={locale} />
    </>
  );
}
