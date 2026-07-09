import Image from "next/image";

import { cn } from "@/lib/utils";

export interface FrameImage {
  src: string;
  alt: string;
}

/**
 * Browser-chrome mockup frame. When a real `image` is provided it renders as
 * a 16:10 capture; otherwise the honest placeholder `children` (a
 * ScreenshotSlot) is shown. No image path should be passed until a real
 * screenshot file exists.
 */
export function BrowserFrame({
  title,
  image,
  children,
  className,
}: {
  title: string;
  image?: FrameImage;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[0_32px_64px_-32px_rgba(0,0,0,0.85)] ring-1 ring-white/5",
        className,
      )}
    >
      <div className="flex items-center gap-3 border-b border-border bg-background/40 px-4 py-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
          <span className="size-2.5 rounded-full border border-border bg-muted/60" />
        </span>
        <span className="min-w-0 flex-1 truncate rounded-md border border-border/60 bg-background/60 px-3 py-1 text-center font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>
      {image ? (
        <div className="relative aspect-[16/10]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover object-top"
          />
        </div>
      ) : (
        children
      )}
    </figure>
  );
}

/**
 * Honest placeholder for a not-yet-captured interface screenshot.
 * Never pretends to be a real capture.
 */
export function ScreenshotSlot({
  label = "Screenshot slot reserved — interface capture to be added",
}: {
  label?: string;
}) {
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.016)_10px,rgba(255,255,255,0.016)_11px)] p-6">
      <div className="rounded-md border border-dashed border-border bg-background/40 px-4 py-2.5 text-center">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}
