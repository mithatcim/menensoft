import { GitBranch, Mail, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Contact",
  description: "Get in touch about a project — email is the fastest way.",
  path: "/contact",
});

export default function ContactPage() {
  // A channel only renders when its real value exists in site config.
  // No placeholders, no "coming soon" rows.
  const secondaryChannels = [
    site.whatsappUrl && {
      key: "whatsapp",
      label: "WhatsApp",
      href: site.whatsappUrl,
      icon: MessageCircle,
    },
    site.githubUrl && {
      key: "github",
      label: "GitHub",
      href: site.githubUrl,
      icon: GitBranch,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    href: string;
    icon: typeof Mail;
  }[];

  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Get in touch"
            description="Email is the fastest way to reach me. Tell me what you're building and where it stands."
          />
        </Reveal>

        <div className="mt-12 max-w-3xl">
          {site.email && (
            <Reveal>
              <SpotlightCard className="rounded-xl border border-border bg-card p-6 ring-1 ring-white/5 md:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_20%_0%,rgba(139,140,248,0.05),transparent)]"
                />
                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-accent/90"
                      />
                      Email
                    </h2>
                    <Mail aria-hidden className="size-4 text-muted-foreground" />
                  </div>
                  <a
                    href={`mailto:${site.email}`}
                    className="mt-5 inline-block font-mono text-lg text-foreground transition-colors hover:text-muted-foreground md:text-xl"
                  >
                    {site.email}
                  </a>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Direct to my inbox. No forms, no ticket queue.
                  </p>
                  <div className="mt-7">
                    <a
                      href={`mailto:${site.email}`}
                      className={cn(
                        buttonVariants({ variant: "cta" }),
                        "h-11 px-6",
                      )}
                    >
                      <Mail className="size-4" />
                      Write me an email
                    </a>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          )}

          {secondaryChannels.length > 0 && (
            <Reveal delay={0.04}>
              <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
                {secondaryChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <SpotlightCard
                      key={channel.key}
                      href={channel.href}
                      external
                      className="flex items-center justify-between gap-4 bg-card p-6 transition-colors hover:bg-muted/40"
                    >
                      <span className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 rounded-full bg-accent/90"
                        />
                        {channel.label}
                      </span>
                      <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                    </SpotlightCard>
                  );
                })}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <div className="mt-12">
              <h2 className="text-xl font-semibold tracking-tight">
                Useful things to include
              </h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <ul className="divide-y divide-border/60">
                  {[
                    "What you're building, in a sentence or two",
                    "Where it stands: an idea, a design, or existing code",
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
                You&apos;ll get a reply with an honest take on scope and
                approach.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
