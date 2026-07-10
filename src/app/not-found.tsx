import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="py-24 md:py-32">
      <Container className="flex flex-col items-center text-center">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Sayfa bulunamadı
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Bu sayfa mevcut değil — ya da başka bir yere taşındı.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-8 h-11 px-6",
          )}
        >
          Ana sayfaya dön
        </Link>
      </Container>
    </section>
  );
}
