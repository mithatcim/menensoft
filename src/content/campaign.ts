/**
 * Entry campaign panel copy (Phase 42A).
 *
 * A single honest offer — "Ücretsiz Sistem Analizi" — framed as a short
 * preliminary conversation, NOT a guaranteed technical audit report. The copy is
 * deliberately broader than "web sitesi": Menensoft is presented as a builder of
 * working business systems (web admin panels, desktop apps, integrations,
 * automations, custom workflows), so the panel speaks to a process problem, not
 * just a website.
 *
 * No fake discount, no countdown, no scarcity, no invented client. The primary
 * CTA points at the EXISTING inquiry wizard with the situation preselected
 * (?durum=manuel — the "work is tracked manually in Excel/WhatsApp" option), so
 * the panel adds no backend and no second form.
 */

export interface CampaignContent {
  /** Offer name — the small accent badge at the top of the panel. */
  offer: string;
  /** Honest one-liner: what this offer actually is, and is not. */
  disclaimer: string;
  /** The bold promise line (dialog title). */
  headline: string;
  /** The problem the visitor recognises (dialog description). */
  problem: string;
  /** What Menensoft actually does about it. */
  solution: string;
  /** Three concrete outcomes. */
  bullets: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** WhatsApp is rendered through ContactLink; body is the prefilled message. */
  whatsapp: { label: string; body: string };
  /** Text button that closes without acting. */
  close: string;
  /** aria-label for the icon close button. */
  closeLabel: string;
  /** A small, true credibility line. */
  trust: string;
}

export const campaign: CampaignContent = {
  offer: "Ücretsiz Sistem Analizi",
  disclaimer:
    "Kısa bir ön değerlendirme ve proje görüşmesidir — garantili bir teknik denetim raporu değil.",
  headline: "İşiniz web sitesiyle değil, çalışan bir sistemle yönetilmeli.",
  problem:
    "Birçok işletmede süreç hâlâ WhatsApp, Excel, manuel takip ve kopuk programlarla ilerler. Site varsa bile sipariş, başvuru, müşteri, stok, randevu veya ekip akışı dağınık kalabilir.",
  solution:
    "Menensoft; web tabanlı admin panelleri, masaüstü uygulamalar, entegrasyonlar, otomasyonlar ve özel iş akışı sistemleri kurar. Önce ihtiyacı netleştirir, sonra doğru çözüm yolunu çıkarır.",
  bullets: [
    "Web panel, masaüstü uygulama veya entegrasyon ihtiyacı netleşir",
    "Sipariş, başvuru, randevu, stok veya müşteri akışı tek düzene alınır",
    "Kapsam önce konuşulur, sonra doğru sistem planlanır",
  ],
  primary: { label: "İşimi kısaca anlatayım", href: "/teklif-al?durum=manuel" },
  secondary: { label: "Örnek sistemleri gör", href: "/projeler" },
  whatsapp: {
    label: "WhatsApp'tan yaz",
    body: "Merhaba, işimi kısaca anlatıp doğru sistem ihtiyacını konuşmak istiyorum.",
  },
  close: "Şimdilik gerek yok",
  closeLabel: "Kampanya panelini kapat",
  trust: "5 gerçek proje üzerinden geliştirilen sistem yaklaşımı.",
};
