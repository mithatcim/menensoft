"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function CopyMessage({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // no clipboard access — the message is right there to select by hand
        }
      }}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs transition-colors",
        copied
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-border text-muted-foreground hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "Kopyalandı" : "Kopyala"}
    </button>
  );
}
