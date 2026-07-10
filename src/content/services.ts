/**
 * Çözüm/hizmet içerikleri. Phase 9'da Türkçeye çevrildi; teklifler somut,
 * süreç dili dürüst — ajans klişesi ve garanti vaadi yok.
 */

export interface Service {
  id: string;
  title: string;
  summary: string;
  includes: string[];
  stack: string[];
  /** Teslimde elinize geçen somut şey. */
  deliverable: string;
}

export const services: Service[] = [
  {
    id: "admin-panels",
    title: "Yönetim panelleri & dashboard'lar",
    summary:
      "Ekibinizin her gün kullandığı iç araçlar: iş için tasarlanmış ekranlardan veri, içerik, sipariş ve kullanıcı yönetimi.",
    includes: [
      "Çekirdek verileriniz için CRUD ekranları",
      "Hassas alanlara rol bazlı erişim",
      "Hızlı kalan arama, filtreleme ve veri tabloları",
      "Doğru doğrulamayla temiz formlar",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "SQL veritabanları"],
    deliverable:
      "Ekibinizin giriş yapıp günü üzerinde yürütebileceği, çalışır bir yönetim paneli.",
  },
  {
    id: "ecommerce",
    title: "E-ticaret sistemleri",
    summary:
      "Vitrin ve arkasındaki yönetim katmanı: ürünler, kategoriler ve içerikler, koda dokunmadan düzenlenebilir.",
    includes: [
      "Ürün kataloğu ve kategori yapısı",
      "Temiz ve hızlı vitrin ürün sayfaları",
      "Teknik olmayan editörler için içerik yönetimi",
      "Sipariş ve stok ekranları",
    ],
    stack: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
    deliverable:
      "Vitrin + arkasındaki yönetim katmanı; koda dokunmadan düzenlenebilir.",
  },
  {
    id: "full-stack-apps",
    title: "Full-stack web uygulamaları",
    summary:
      "Uçtan uca kurulan SaaS tarzı ürünler: veri modeli, backend mantığı ve arayüz, tek tutarlı sistem olarak teslim edilir.",
    includes: [
      "Veri modelleme ve API tasarımı",
      "Kimlik doğrulama ve rol yönetimi",
      "Duyarlı, erişilebilir arayüz",
      "Yayına hazır proje kurulumu",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "SQL veritabanları"],
    deliverable:
      "Tek tutarlı kod tabanı: veri modeli, backend ve arayüz — yayına hazır.",
  },
  {
    id: "automation-tools",
    title: "Otomasyon & iç araçlar",
    summary:
      "Manuel bir iş akışını devralan, amaca özel yazılım: sipariş yönlendirme, içerik hatları, tekrarlayan ofis işleri.",
    includes: [
      "Mevcut manuel sürecin dürüstçe haritalanması",
      "Platform fantezisi değil, iş akışına ölçeklenmiş araç",
      "Halihazırda kullandığınız sistemlerle entegrasyon",
      "Ekibinizin takip edebileceği dokümantasyon",
    ],
    stack: ["TypeScript", "Node.js", "Next.js"],
    deliverable:
      "Kapsamına göre kurgulanmış, manuel iş akışını devralan araç — dokümantasyonuyla birlikte.",
  },
];

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
