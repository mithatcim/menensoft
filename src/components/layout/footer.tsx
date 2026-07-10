import Link from "next/link";

import { Container } from "@/components/layout/container";
import { footerNav } from "@/content/navigation";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-12 md:py-16">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-semibold tracking-tight">{site.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {site.positioning}
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Kurucu &amp; geliştirici: {site.founder}
            </p>
          </div>
          <nav aria-label="Alt menü">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <div className="flex flex-col gap-2 font-mono sm:flex-row sm:items-center sm:gap-6">
            {site.githubUrl && (
              <a
                href={site.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-foreground"
              >
                GitHub
              </a>
            )}
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-foreground"
            >
              {site.email}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
