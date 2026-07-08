"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import { contactItem, mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground"
        >
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={contactItem.href}
            className={cn(buttonVariants({ variant: "outline" }), "ml-3")}
          >
            {contactItem.label}
          </Link>
        </nav>

        <MobileNav />
      </Container>
    </header>
  );
}
