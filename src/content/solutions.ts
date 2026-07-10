/**
 * /cozumler sayfasının içeriği: Menensoft'un sattığı çözüm kategorileri ve
 * dönüşüm bölümleri. Her kategori yalnızca gerçekten kurulabilen ve
 * projelerle kanıtlanabilen işleri anlatır — şişirilmiş vaat yok.
 */

export interface SolutionCategory {
  id: string;
  title: string;
  /** Çözülen problem — ziyaretçinin kendi durumunu tanıyacağı cümle. */
  problem: string;
  /** Bu kategoride somut olarak neler kurulur. */
  builds: string[];
  /** Bu yetkinliği kanıtlayan gerçek proje slug'ları. */
  relatedSlugs: string[];
}

export const solutions: SolutionCategory[] = [
  {
    id: "e-ticaret",
    title: "E-ticaret sistemleri",
    problem:
      "Hazır paketlerin kısıtladığı, her değişiklik için koda bağımlı kalan ya da yönetilemeyen online satış altyapıları.",
    builds: [
      "Ürün kataloğu, kategori yapısı ve hızlı vitrin sayfaları",
      "Kod bilmeden yönetilen içerik ve sayfa düzeni",
      "Sipariş ve stok ekranları",
      "Yönetim paneliyle bütünleşik, sahip olduğunuz bir e-ticaret sistemi",
    ],
    relatedSlugs: ["ecommerce-cms"],
  },
  {
    id: "yonetim-paneli",
    title: "Yönetim panelleri",
    problem:
      "Tablolarda, mesajlarda ve dağınık araçlarda yürüyen iş verisi; kimin neyi değiştirdiği belli değil.",
    builds: [
      "Çekirdek verileriniz için admin panel ekranları",
      "Rol bazlı erişim ve yetkilendirme",
      "Arama, filtreleme ve hızlı veri tabloları",
      "Doğrulamalı formlar ve tutarlı kayıt akışı",
    ],
    relatedSlugs: ["ecommerce-cms", "orva-psychology"],
  },
  {
    id: "dashboard-raporlama",
    title: "Dashboard ve raporlama",
    problem:
      "İşin anlık durumu ancak sorup soruşturarak öğreniliyor; tek bakışta görünen net bir tablo yok.",
    builds: [
      "Canlı operasyon görünümleri",
      "Role özel dashboard ekranları",
      "Güncel kalan listeler, filtreler ve durum akışları",
      "Log ve kayıt inceleme ekranları",
    ],
    relatedSlugs: ["restaurant-qr-system", "log-management-platform"],
  },
  {
    id: "is-akisi-otomasyonu",
    title: "İş akışı otomasyonu",
    problem:
      "Elle tekrarlanan işler zaman sızdırıyor; süreç kişiye bağımlı ilerliyor ve hata üretiyor.",
    builds: [
      "Mevcut manuel sürecin haritalanması ve sadeleştirilmesi",
      "İş akışına göre ölçülmüş, amaca özel yazılım",
      "Kullandığınız sistemlerle entegrasyon",
      "Sipariş yönlendirme, randevu talebi gibi uçtan uca akışlar",
    ],
    relatedSlugs: ["restaurant-qr-system", "cendovar"],
  },
  {
    id: "kurumsal-site-panel",
    title: "Kurumsal web sitesi + admin panel",
    problem:
      "Site var ama her içerik değişikliği için geliştirici gerekiyor; güncel tutmak külfete dönüşüyor.",
    builds: [
      "Hızlı, güven veren kurumsal web sitesi",
      "İçeriği panelden yönetme — geliştiriciye bağımlılık yok",
      "Randevu ve iletişim talebi akışı",
      "Arama motorlarına uygun semantik yapı",
    ],
    relatedSlugs: ["orva-psychology"],
  },
  {
    id: "operasyon-sistemleri",
    title: "Operasyon sistemleri",
    problem:
      "Tek bir sipariş ya da talep; mutfak, kasa, saha gibi birden çok istasyona elle taşınıyor.",
    builds: [
      "Kaynağında bir kez yakalanan iş akışı",
      "Her rol için ayrı ekran — restoran QR sipariş sistemi gibi",
      "Roller arasında paylaşılan canlı durum",
      "Bir iş gününü taşıyacak şekilde kurulan altyapı",
    ],
    relatedSlugs: ["restaurant-qr-system", "log-management-platform"],
  },
];

/** Kimler için uygun — dönüşüm bölümü. */
export const audience = [
  "Operasyonunu tablolar ve mesajlarla yürüten küçük ve orta ölçekli işletmeler",
  "Hazır paketlerin sınırına takılan, kendi sistemine sahip olmak isteyen ekipler",
  "Sitesini panelden yönetmek isteyen, geliştiriciye bağımlı kalmak istemeyen işletmeler",
  "İç sürecini özel yazılıma taşımak isteyen operasyon ekipleri",
];

/** Ne zaman ihtiyaç duyarsınız — dönüşüm bölümü. */
export const triggers = [
  "Sipariş, talep veya randevular elle taşınıyor ve arada kayboluyorsa",
  "Aynı veri birden çok yere tekrar tekrar giriliyorsa",
  "İşin durumu ancak telefonla sorularak öğrenilebiliyorsa",
  "Her içerik değişikliği için geliştirici bekleniyorsa",
];

/** Teslimde ne alırsınız — dönüşüm bölümü. */
export const deliverables = [
  "Çalışır durumda teslim edilen bir web sistemi",
  "Yönetim paneli ve role uygun ekranlar",
  "Sürdürülebilir, incelenebilir kod tabanı",
  "Dokümantasyon, net kapsam ve temiz devir",
];

/** Menensoft'un kaçındıkları — güven veren dürüstlük bölümü. */
export const avoided = [
  "İşinize uymayan şablon üstüne şablon çözümler",
  "Belirsiz kapsamla açık uçlu faturalama",
  "İhtiyacın ötesinde şişirilmiş platform fantezileri",
  "Devredilemeyen, kişiye bağımlı kara kutular",
];
