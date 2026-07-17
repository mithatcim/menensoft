"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { buttonVariants } from "@/components/ui/button";
import {
  ctaItem,
  ctaItemEn,
  footerNav,
  footerNavEn,
  mainNav,
  mainNavEn,
} from "@/content/navigation";
import { site } from "@/content/site";
import { alternatePathFor, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/** TR/EN geçişi: bulunduğun sayfanın diğer dildeki eşdeğerine gider. */
function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() || "/";
  const alternate = alternatePathFor(pathname);
  const trHref = locale === "tr" ? pathname : alternate;
  const enHref = locale === "en" ? pathname : alternate;
  return (
    <span
      className="flex items-center gap-1 font-mono text-xs"
      aria-label={locale === "tr" ? "Dil seçimi" : "Language"}
    >
      <Link
        href={trHref}
        data-lang-switch="tr"
        aria-current={locale === "tr" ? "true" : undefined}
        className={cn(
          "rounded px-1.5 py-1 transition-colors",
          locale === "tr"
            ? "text-foreground"
            : "text-muted-foreground/60 hover:text-foreground",
        )}
      >
        TR
      </Link>
      <span aria-hidden className="text-muted-foreground/30">
        /
      </span>
      <Link
        href={enHref}
        data-lang-switch="en"
        aria-current={locale === "en" ? "true" : undefined}
        className={cn(
          "rounded px-1.5 py-1 transition-colors",
          locale === "en"
            ? "text-foreground"
            : "text-muted-foreground/60 hover:text-foreground",
        )}
      >
        EN
      </Link>
    </span>
  );
}

export function Header({ locale = "tr" }: { locale?: Locale }) {
  const pathname = usePathname();
  const nav = locale === "en" ? mainNavEn : mainNav;
  const cta = locale === "en" ? ctaItemEn : ctaItem;
  const mobileItems = locale === "en" ? footerNavEn : footerNav;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between">
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="inline-flex items-center py-1"
        >
          {/* Approved raster logo (transparent PNG), dark-navy artwork that reads
              cleanly on the Phase 41E light navbar. width/height carry the exact
              aspect ratio so there is no CLS; a fixed height with width auto
              sizes it without any distortion. */}
          <Image
            src="/brand/menensoft-logo-horizontal.png"
            alt={site.name}
            width={1200}
            height={245}
            priority
            sizes="180px"
            className="h-7 w-auto md:h-8"
          />
        </Link>

        <nav
          aria-label={locale === "en" ? "Main menu" : "Ana menü"}
          className="hidden items-center gap-1 md:flex"
        >
          {nav.map((item) => {
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
          <span className="mx-2">
            <LanguageSwitch locale={locale} />
          </span>
          <Link
            href={cta.href}
            className={cn(buttonVariants({ variant: "cta" }), "ml-1")}
          >
            {cta.label}
          </Link>
        </nav>

        {/* mobil: dil geçişi menü düğmesinin yanında da erişilebilir */}
        <span className="flex items-center gap-2 md:hidden">
          <LanguageSwitch locale={locale} />
          <MobileNav items={mobileItems} locale={locale} />
        </span>
      </Container>
    </header>
  );
}
