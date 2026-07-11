/**
 * Ortak süreç içeriği. Çözüm kategorileri Phase 9'dan itibaren
 * src/content/solutions.ts'te yaşar; burada yalnızca /surec ve /hakkimda
 * sayfalarının paylaştığı çalışma adımları kalır.
 */

export interface WorkflowStep {
  step: string;
  title: string;
  description: string;
}

export const workflow: WorkflowStep[] = [
  {
    step: "01",
    title: "Kapsam",
    description: "Neyin kurulacağında — ve neyin dışarıda kalacağında — anlaşılır.",
  },
  {
    step: "02",
    title: "Geliştirme",
    description: "Çalışan yazılım, küçük ve gözden geçirilebilir adımlarla ilerler.",
  },
  {
    step: "03",
    title: "İterasyon",
    description: "Varsayıma değil, gerçek kullanıma ve geri bildirime göre ayarlanır.",
  },
  {
    step: "04",
    title: "Teslim",
    description: "Çalışır sistem; dokümante edilmiş ve temiz şekilde devredilmiş.",
  },
];
