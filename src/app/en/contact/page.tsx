import { ArrowRight, GitBranch, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { ContactForm } from "@/components/leads/contact-form";
import { ContactLink } from "@/components/shared/contact-link";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Contact",
  description:
    "Email, WhatsApp, or a short project brief — all three go straight to the founder. No spec required.",
  path: "/en/contact",
});

export default function EnContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          {/* Since Phase 33B this is the nav primary's destination: not just the
              email channel, but the entry point that opens all three doors. */}
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Write directly, or build a short brief"
            description="For a quick question, email or WhatsApp is enough. If you want to talk through a system, the short brief gets the scope clear in the first message. All three reach the founder directly."
          />
        </Reveal>

        <div className="mt-12 max-w-5xl">
          {/* Three channels that do three different jobs. Putting them side by
              side without saying when each is the right one produces hesitation,
              not choice. */}
          <div className="grid gap-4 md:grid-cols-3">
            {site.email && (
              <Reveal>
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card p-6 ring-1 ring-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      Write directly
                    </h2>
                    <Mail
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    Email is the easiest way to carry detail. No forms, no
                    ticket queue.
                  </p>
                  <ContactLink
                    channel="email"
                    className="mt-4 inline-block font-mono text-sm break-all text-foreground/90 transition-colors hover:text-foreground"
                  >
                    {site.email}
                  </ContactLink>
                  <div className="mt-6 pt-1">
                    <ContactLink
                      channel="email"
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      <Mail className="size-4" />
                      Send an email
                    </ContactLink>
                  </div>
                </SpotlightCard>
              </Reveal>
            )}

            {site.whatsappUrl && (
              <Reveal delay={0.04}>
                <SpotlightCard className="flex h-full flex-col rounded-xl border border-border bg-card p-6 ring-1 ring-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      WhatsApp
                    </h2>
                    <MessageCircle
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    The fastest route if you have a short question. Enough on
                    its own for a first contact.
                  </p>
                  <div className="mt-auto pt-6">
                    <ContactLink
                      channel="whatsapp"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      <MessageCircle className="size-4" />
                      Message on WhatsApp
                    </ContactLink>
                  </div>
                </SpotlightCard>
              </Reveal>
            )}

            <Reveal delay={0.08}>
              <SpotlightCard className="flex h-full flex-col rounded-xl border border-accent/25 bg-card p-6 ring-1 ring-accent/10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_0%,rgba(139,140,248,0.06),transparent)]"
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      Short brief
                    </h2>
                    <ArrowRight
                      aria-hidden
                      className="size-4 text-muted-foreground"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    For a system conversation: pick a system type and your
                    message gets built. Edit it, then send it by email or
                    WhatsApp.
                  </p>
                  <div className="mt-auto pt-6">
                    <Link
                      href="/en/start-project"
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-10 w-full px-5",
                      )}
                    >
                      Build a short brief
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>

          {/* A fourth door, not a replacement for the three: for the visitor who
              would rather not open a mail client. If the form fails, the channels
              above are still there — and the message is handed to them intact. */}
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <Reveal delay={0.1}>
              <ContactForm locale="en" />
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={0.12}>
                <h2 className="text-xl font-semibold tracking-tight">
                  Useful things to include
                </h2>
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <ul className="divide-y divide-border/60">
                    {[
                      "What you want to build, in a sentence or two",
                      "Where it stands today: an idea, a design, or existing code",
                      "Any rough timeline you have in mind",
                    ].map((item) => (
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
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  And if you have none of it yet, that&apos;s fine — a few
                  sentences are enough. No spec expected.
                </p>
              </Reveal>

              {site.githubUrl && (
                <Reveal delay={0.14}>
                  <div className="rounded-xl border border-border bg-card/50 p-6">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground/80 uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rotate-45 border border-muted-foreground/50"
                      />
                      Code
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Some of the work is public.
                    </p>
                    <a
                      href={site.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 font-mono text-sm text-foreground/85 transition-colors hover:text-foreground"
                    >
                      <GitBranch className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                      GitHub
                    </a>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
