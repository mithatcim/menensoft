import { Mail } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { buttonVariants } from "@/components/ui/button";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a project — email is the fastest way.",
};

export default function ContactPage() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Contact"
          title="Get in touch"
          description="Email is the fastest way to reach me. Tell me what you're building and where it stands."
        />

        <div className="mt-12 max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Email
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-block font-mono text-lg text-foreground transition-colors hover:text-muted-foreground"
            >
              {site.email}
            </a>
            <div className="mt-6">
              <a
                href={`mailto:${site.email}`}
                className={cn(buttonVariants(), "h-11 px-6")}
              >
                <Mail className="size-4" />
                Write me an email
              </a>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-xl font-semibold tracking-tight">
              Useful things to include
            </h2>
            <ul className="mt-4 space-y-2">
              {[
                "What you're building, in a sentence or two",
                "Where it stands — an idea, a design, or existing code",
                "Any rough timeline you have in mind",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden
                    className="mt-2.5 size-1 shrink-0 rounded-full bg-foreground/40"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
