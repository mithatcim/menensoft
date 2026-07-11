import Link from "next/link";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="py-24 md:py-36">
      <Container className="text-center">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8">
          <Link
            href="/en"
            className={cn(buttonVariants({ variant: "outline" }), "h-11 px-6")}
          >
            Back to home
          </Link>
        </div>
      </Container>
    </section>
  );
}
