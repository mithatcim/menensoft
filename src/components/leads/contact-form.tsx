"use client";

import { Check, Mail, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

import { Field, Honeypot, inputClass } from "@/components/leads/field";
import { ContactLink } from "@/components/shared/contact-link";
import { buttonVariants } from "@/components/ui/button";
import { leadFormCopy } from "@/content/lead-form";
import { track } from "@/components/analytics/analytics";
import { submitLead } from "@/lib/leads/client";
import { type ContactPreference } from "@/lib/leads/types";
import { type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/**
 * The contact page's fourth door (Phase 33C): a short message, submitted to
 * /api/lead, for visitors who don't want to open a mail client.
 *
 * It does NOT replace the three cards above it. Email and WhatsApp remain
 * first-class — and if this form fails, they are what the visitor is handed,
 * with their text intact. The form is a convenience; the channels are the
 * product.
 */
export function ContactForm({ locale = "tr" }: { locale?: Locale }) {
  const copy = leadFormCopy[locale];
  const sourcePath = locale === "en" ? "/en/contact" : "/iletisim";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [preference, setPreference] = useState<ContactPreference>("email");
  const [company, setCompany] = useState(""); // honeypot

  // Lazy initializer, not an effect: state initializers re-run on the client at
  // hydration, so this is when the visitor actually saw the form.
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">(
    "idle",
  );

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = copy.errName;
    if (!message.trim()) next.message = copy.errMessage;
    if (!email.trim() && !phone.trim()) next.email = copy.errReach;
    else if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = copy.errEmail;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    if (!validate()) return;

    setState("sending");
    const res = await submitLead({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      message: message.trim(),
      language: locale,
      contactPreference: preference,
      sourcePath,
      company,
      formStartedAt: startedAt,
    });

    if (res.ok) {
      // Only on a CONFIRMED insert. A form_submit event that fires on failure
      // would inflate the one number that is supposed to mean "this worked".
      // Nothing personal travels with it — no name, no email, no message.
      track("form_submit", locale, { label: "contact", channel: preference });
      setState("sent");
      return;
    }
    if (res.code === "validation" && res.field === "email") {
      setErrors({ email: copy.errEmail });
      setState("idle");
      return;
    }
    if (res.code === "rate_limit") {
      setErrors({ form: copy.errRate });
      setState("idle");
      return;
    }
    // unconfigured / server / network — the visitor did nothing wrong, and their
    // text is still in the textarea. Hand them a channel that works.
    setState("failed");
  };

  if (state === "sent") {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
        <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Check className="size-4 text-accent" />
          {copy.successTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {copy.successBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setMessage("");
            setErrors({});
            setStartedAt(Date.now());
            setState("idle");
          }}
          className="mt-4 rounded-sm font-mono text-xs text-foreground/85 underline underline-offset-4 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {copy.successAgain}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-xl border border-border bg-card/60 p-6 ring-1 ring-white/5"
    >
      <Honeypot label={copy.honeypot} value={company} onChange={setCompany} />

      <h3 className="text-base font-semibold tracking-tight">
        {copy.contactTitle}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {copy.contactLead}
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label={copy.name} error={errors.name}>
          <input
            id="cf-name"
            name="name"
            autoComplete="name"
            className={inputClass}
            placeholder={copy.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>
        <Field id="cf-email" label={copy.email} error={errors.email}>
          <input
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={inputClass}
            placeholder={copy.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field id="cf-phone" label={copy.phone} hint={copy.phoneOptional}>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={inputClass}
            placeholder={copy.phonePlaceholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field id="cf-message" label={copy.message} error={errors.message}>
          <textarea
            id="cf-message"
            name="message"
            rows={5}
            maxLength={1500}
            className={cn(inputClass, "min-h-32 resize-y leading-relaxed")}
            placeholder={copy.messagePlaceholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>
      </div>

      <fieldset className="mt-5">
        <legend className="font-mono text-xs tracking-widest text-muted-foreground/70 uppercase">
          {copy.preference}
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["email", copy.preferenceEmail, Mail],
              ["whatsapp", copy.preferenceWhatsapp, MessageCircle],
            ] as const
          ).map(([id, label, Icon]) => {
            const isSel = preference === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPreference(id)}
                aria-pressed={isSel}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isSel
                    ? "border-accent/50 bg-accent/10 text-foreground"
                    : "border-border bg-background/50 text-foreground/80 hover:border-foreground/20",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5",
                    isSel ? "text-accent" : "text-muted-foreground",
                  )}
                />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {errors.form && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-accent/30 bg-accent/5 px-3 py-2 text-xs leading-relaxed text-foreground/90"
        >
          {errors.form}
        </p>
      )}

      {/* The whole point of the phase: a failed insert must not read as a lost
          message. Say what happened, keep their text, hand them a live channel. */}
      {state === "failed" && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-accent/30 bg-accent/5 p-4"
        >
          <p className="text-sm font-medium text-foreground">
            {copy.errFallbackTitle}
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            {copy.errFallbackBody}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <ContactLink
              channel="email"
              body={message}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 w-full px-4",
              )}
            >
              <Mail className="size-4" />
              {copy.preferenceEmail}
            </ContactLink>
            <ContactLink
              channel="whatsapp"
              body={message}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 w-full px-4",
              )}
            >
              <MessageCircle className="size-4" />
              {copy.preferenceWhatsapp}
            </ContactLink>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className={cn(
          buttonVariants({ variant: "cta" }),
          "mt-5 h-11 w-full px-5 disabled:opacity-60",
        )}
      >
        <Send className="size-4" />
        {state === "sending" ? copy.submitting : copy.submit}
      </button>

      <p className="mt-3 text-xs leading-relaxed text-muted-foreground/70">
        {copy.contactShort}
      </p>
    </form>
  );
}
