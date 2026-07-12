import { type Locale } from "@/lib/locale";

/**
 * Lead form copy (Phase 33C). Both the inquiry studio's send panel and the
 * contact page's short-message form read from here.
 *
 * Tone rules this file has to keep:
 * - No response-time promise. "En kısa sürede dönüş yapılır" is a promise nobody
 *   can keep on a bad week, and the site has never made one.
 * - No fake reassurance on failure. If the database refused the message, say so
 *   and hand the visitor a channel that works — do not soften it into "we'll
 *   look into it".
 * - Ask for as little as possible. Name, plus one way to reply. That is it.
 */

interface LeadFormCopy {
  // inquiry studio
  formTitle: string;
  formHint: string;
  // fields
  name: string;
  namePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phoneOptional: string;
  phonePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  preference: string;
  preferenceEmail: string;
  preferenceWhatsapp: string;
  honeypot: string;
  // actions
  submit: string;
  submitting: string;
  // states
  successTitle: string;
  successBody: string;
  successAgain: string;
  // errors
  errName: string;
  errReach: string;
  errEmail: string;
  errMessage: string;
  errRate: string;
  /** Shown when the DB is unreachable or unconfigured — the message is NOT lost. */
  errFallbackTitle: string;
  errFallbackBody: string;
  // contact page form
  contactTitle: string;
  contactLead: string;
  contactShort: string;
}

export const leadFormCopy: Record<Locale, LeadFormCopy> = {
  tr: {
    formTitle: "Site üzerinden gönderin",
    formHint:
      "Adınız ve size dönebileceğim bir kanal yeterli. Mesaj yukarıda yazdığınız hâliyle gider.",

    name: "Adınız",
    namePlaceholder: "Ad Soyad",
    email: "E-posta",
    emailPlaceholder: "ornek@sirket.com",
    phone: "Telefon / WhatsApp",
    phoneOptional: "isteğe bağlı",
    phonePlaceholder: "+90 …",
    message: "Mesajınız",
    messagePlaceholder:
      "Ne kurmak istediğinizi birkaç cümleyle yazın. Şartname gerekmez.",
    preference: "Size nasıl döneyim?",
    preferenceEmail: "E-posta",
    preferenceWhatsapp: "WhatsApp",
    honeypot: "Şirket (boş bırakın)",

    submit: "Formu gönder",
    submitting: "Gönderiliyor…",

    successTitle: "Mesajınız ulaştı",
    successBody:
      "Doğrudan kurucuya düştü. Dönüş, kapsamı netleştiren birkaç somut soruyla gelir.",
    successAgain: "Yeni mesaj yaz",

    errName: "Adınızı yazın.",
    errReach: "E-posta ya da telefon — en az biri gerekli, yoksa dönemem.",
    errEmail: "Bu e-posta adresi geçerli görünmüyor.",
    errMessage: "Mesaj boş olamaz.",
    errRate:
      "Kısa sürede çok fazla gönderim oldu. Birkaç dakika sonra deneyin.",

    errFallbackTitle: "Form şu an gönderilemiyor",
    errFallbackBody:
      "Mesajınız duruyor — kaybolmadı. Aynı mesajı e-posta ya da WhatsApp ile doğrudan gönderebilirsiniz; ikisi de kurucuya ulaşır.",

    contactTitle: "Kısa mesaj bırakın",
    contactLead:
      "E-posta istemcisi açmak istemiyorsanız buradan da yazabilirsiniz. Aynı yere düşer.",
    contactShort: "Ad, bir kanal ve mesaj — hepsi bu.",
  },

  en: {
    formTitle: "Send through the site",
    formHint:
      "Your name and one way to reply is enough. The message goes exactly as you wrote it above.",

    name: "Your name",
    namePlaceholder: "Full name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    phone: "Phone / WhatsApp",
    phoneOptional: "optional",
    phonePlaceholder: "+90 …",
    message: "Your message",
    messagePlaceholder:
      "A few sentences about what you want to build. No spec required.",
    preference: "How should I reply?",
    preferenceEmail: "Email",
    preferenceWhatsapp: "WhatsApp",
    honeypot: "Company (leave empty)",

    submit: "Send form",
    submitting: "Sending…",

    successTitle: "Your message arrived",
    successBody:
      "It went straight to the founder. What comes back is a few concrete questions that clarify the scope.",
    successAgain: "Write another message",

    errName: "Please add your name.",
    errReach: "Email or phone — at least one, or there's no way to reply.",
    errEmail: "That email address doesn't look right.",
    errMessage: "The message can't be empty.",
    errRate: "Too many submissions just now. Try again in a few minutes.",

    errFallbackTitle: "The form can't send right now",
    errFallbackBody:
      "Your message is still here — nothing was lost. You can send the same text by email or WhatsApp instead; both reach the founder.",

    contactTitle: "Leave a short message",
    contactLead:
      "If you'd rather not open a mail client, write here instead. It lands in the same place.",
    contactShort: "A name, one channel, and the message. That's it.",
  },
};
