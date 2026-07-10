/**
 * /sss sayfasının içeriği. Cevaplar kısa, doğrudan ve dürüst — arama
 * motorlarının ve yapay zekâ cevap motorlarının alıntılayabileceği netlikte.
 * Sabit fiyat, müşteri adı, canlı adres gibi doğrulanamayan iddialar yok.
 */

export interface FaqItem {
  id: string;
  question: string;
  /** Düz metin cevap — FAQPage JSON-LD'de de aynen kullanılır. */
  answer: string;
  /** Cevabın altında gösterilen ilgili iç bağlantılar. */
  links?: { label: string; href: string }[];
}

export const faq: FaqItem[] = [
  {
    id: "menensoft-ne-yapar",
    question: "Menensoft ne yapar?",
    answer:
      "Menensoft, işletmeler için çalışan web sistemleri kurar: e-ticaret sistemleri, yönetim panelleri, dashboard ve raporlama ekranları, iş akışı otomasyonu ve panelle yönetilen kurumsal web siteleri. Tek sayfalık vitrinler değil; veri modeli, backend, yönetim paneli ve arayüzüyle uçtan uca sistemler.",
    links: [
      { label: "Çözümleri incele", href: "/cozumler" },
      { label: "Projeleri gör", href: "/projeler" },
    ],
  },
  {
    id: "kimler-icin",
    question: "Kimler için web sistemi geliştirilir?",
    answer:
      "Operasyonunu tablolar, mesajlar ve dağınık araçlarla yürüten küçük ve orta ölçekli işletmeler; hazır paketlerin sınırına takılan ekipler; sitesini geliştiriciye bağımlı kalmadan panelden yönetmek isteyen işletmeler için. Sektörden bağımsız — belirleyici olan, dijitale taşınacak gerçek bir iş akışının olması.",
  },
  {
    id: "site-mi-sistem-mi",
    question: "Sadece web sitesi mi yapılır, yoksa panel ve sistem de var mı?",
    answer:
      "Asıl odak sistemdir: yönetim paneli, dashboard, sipariş ve iş akışı ekranları. Kurumsal web sitesi de yapılır; ancak genellikle arkasında içerik yönetimi sağlayan bir admin panel ile birlikte teslim edilir.",
    links: [{ label: "Çözüm kategorileri", href: "/cozumler" }],
  },
  {
    id: "e-ticaret",
    question: "E-ticaret sistemi geliştirilebilir mi?",
    answer:
      "Evet. Ürün kataloğu, kategori yapısı, vitrin sayfaları, içerik yönetimi ve sipariş ekranlarını kapsayan tamamlanmış bir e-ticaret ürün altyapısı mevcut. Sistem, kod bilmeden panelden yönetilecek şekilde kurulur.",
    links: [
      { label: "E-ticaret projesi", href: "/projeler/ecommerce-cms" },
    ],
  },
  {
    id: "panel-dashboard",
    question: "Yönetim paneli ve dashboard yapılır mı?",
    answer:
      "Evet. Rol bazlı erişimli admin paneller, veri tabloları, arama ve filtreleme, canlı operasyon görünümleri ve role özel dashboard ekranları kurulur. Restoran QR sipariş sistemi ve log yönetim platformu gibi projelerde bu ekranlar uçtan uca geliştirildi.",
    links: [{ label: "Projeleri gör", href: "/projeler" }],
  },
  {
    id: "surec",
    question: "Proje süreci nasıl ilerler?",
    answer:
      "Beş adımda: talep, kapsam netleştirme, mimari tasarım, geliştirme ve teslim. Kapsam yazılı olarak netleşmeden geliştirme başlamaz; iş küçük ve incelenebilir adımlarla ilerler. Sürecin tamamı /surec sayfasında anlatılıyor.",
    links: [{ label: "Süreci incele", href: "/surec" }],
  },
  {
    id: "teslimde-ne-alinir",
    question: "Teslimde ne alınır?",
    answer:
      "Çalışır durumda bir web sistemi, yönetim paneli ve role uygun ekranlar, sürdürülebilir ve incelenebilir bir kod tabanı, dokümantasyon ve temiz bir devir. Amaç, teslimden sonra işletebileceğiniz bir sistem bırakmaktır — kişiye bağımlı bir kara kutu değil.",
  },
  {
    id: "projeler-canli-mi",
    question: "Mevcut projeler canlı mı?",
    answer:
      "Projeler tamamlanmış ve çalışır durumda sistemlerdir; bir kısmı müşteri ihtiyacına göre teslim edilmiş, bir kısmı iç ürün altyapısı olarak kullanılmaktadır. Herkese açık canlı adresler bu sitede yayınlanmıyor; her projenin kapsamı, modülleri ve mimarisi kendi proje sayfasında şeffaf biçimde listelenir.",
    links: [{ label: "Proje detayları", href: "/projeler" }],
  },
  {
    id: "iletisim",
    question: "İletişim nasıl kurulur?",
    answer:
      "En hızlı kanal e-posta: mithat.menen@gmail.com. WhatsApp üzerinden de ulaşabilirsiniz. Teklif almak için /teklif-al sayfasındaki hazır akışı kullanabilirsiniz; mesajınız doğrudan kurucuya ulaşır.",
    links: [
      { label: "Teklif al", href: "/teklif-al" },
      { label: "İletişim", href: "/iletisim" },
    ],
  },
  {
    id: "fiyat",
    question: "Fiyat nasıl belirlenir?",
    answer:
      "Fiyat, kapsam ve modüllere göre belirlenir. Sabit bir liste fiyatı yoktur; ekran sayısı, rol ve yetki yapısı, entegrasyonlar ve içerik yönetimi ihtiyacı kapsamı belirler. Kapsam yazılı olarak netleştikten sonra net bir teklif sunulur — belirsiz işi şişirmek yerine netleştirmek tercih edilir.",
    links: [{ label: "Teklif al", href: "/teklif-al" }],
  },
];
