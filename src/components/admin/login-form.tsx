"use client";

import { LogIn } from "lucide-react";
import { useActionState } from "react";

import { Field, inputClass } from "@/components/leads/field";
import { buttonVariants } from "@/components/ui/button";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function LoginForm({ disabled }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <form action={action} className="mt-6 space-y-4">
      <Field id="admin-email" label="E-posta">
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </Field>

      <Field id="admin-password" label="Parola">
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </Field>

      {/* One message for both a wrong email and a wrong password — telling an
          attacker which half was right hands over the other half for free. */}
      {state.error && (
        <p
          role="alert"
          className="rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-foreground/90"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || disabled}
        className={cn(
          buttonVariants({ variant: "cta" }),
          "h-11 w-full px-5 disabled:opacity-60",
        )}
      >
        <LogIn className="size-4" />
        {pending ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
