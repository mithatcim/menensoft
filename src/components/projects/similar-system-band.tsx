import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { buttonVariants } from "@/components/ui/button";
import { projectToFitType } from "@/content/fit";
import { type Project } from "@/content/projects";
import { sectors } from "@/content/sectors";
import { systems } from "@/content/systems";
import { cn } from "@/lib/utils";

/**
 * Proje detayının satış köprüsü: "bu yapı sizin işiniz için de kurulabilir".
 * İlgili sistem/sektör sayfaları içerikten ters aramayla bulunur; birincil
 * CTA sihirbaza önseçimle gider. Uydurma kanıt yok — bağlantılar gerçek.
 */
export function SimilarSystemBand({ project }: { project: Project }) {
  const fitType = projectToFitType[project.slug];
  const quoteHref = fitType ? `/teklif-al?tur=${fitType}` : "/teklif-al";

  const relatedSystems = systems.filter((sys) =>
    sys.relatedProjects.some((rp) => rp.slug === project.slug),
  );
  const relatedSectors = sectors.filter((sec) =>
    sec.relatedProjects.some((rp) => rp.slug === project.slug),
  );

  return (
    <section className="pb-4 md:pb-6">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-xl border border-accent/25 bg-accent/5 p-6 md:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_0%,rgba(139,140,248,0.08),transparent)]"
            />
            <div className="relative">
              <p className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                <span aria-hidden className="size-1.5 bg-accent/90" />
                Teslim edilen yapı — sizin için de kurulabilir
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-balance md:text-2xl">
                Benzer bir sisteme mi ihtiyacınız var?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Bu sayfadaki modüller ve akış, gerçek bir ihtiyaç için kuruldu.
                Sizin işinizin girdisi farklı olabilir; teslim mantığı aynıdır:
                net kapsam, yönetilebilir panel, devredilebilir yapı.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href={quoteHref}
                  className={cn(buttonVariants({ variant: "cta" }), "h-11 px-6")}
                >
                  Benzer sistem istiyorum
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/surec"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-11 px-6",
                  )}
                >
                  Süreci gör
                </Link>
              </div>
              {(relatedSystems.length > 0 || relatedSectors.length > 0) && (
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border/60 pt-4 text-sm">
                  {relatedSystems.map((sys) => (
                    <Link
                      key={sys.slug}
                      href={`/sistemler/${sys.slug}`}
                      className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {sys.title}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                  {relatedSectors.map((sec) => (
                    <Link
                      key={sec.slug}
                      href={`/sektorler/${sec.slug}`}
                      className="group inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {sec.title}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
